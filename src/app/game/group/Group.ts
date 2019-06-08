import { getManager } from 'typeorm';
import { TimeHelper } from '../../common';
import { GroupDao, GroupEntity, GroupMemberEntity } from '../../database';
import { Emulator } from '../../Emulator';
import { GroupInfoComposer, GroupMemberComposer, GroupMembersRefreshComposer, Outgoing, OutgoingPacket } from '../../packets';
import { Room } from '../room';
import { PermissionList } from '../security';
import { User } from '../user';
import { Forum } from './forum/Forum';
import { GroupMember } from './GroupMember';
import { GroupRank } from './GroupRank';
import { GroupState } from './GroupState';

export class Group
{
    private _entity: GroupEntity;

    private _forum: Forum;

    private _activeMembers: User[];
    private _totalMembers: number;
    private _totalMembersPending: number;

    private _lastAccess: number;

    constructor(entity: GroupEntity)
    {
        if(!(entity instanceof GroupEntity)) throw new Error('invalid_entity');

        this._entity                = entity;

        this._forum                 = new Forum(this);

        this._activeMembers         = [];
        this._totalMembers          = entity.totalMembers || 0;
        this._totalMembersPending   = entity.totalMembersPending || 0;

        this._lastAccess            = TimeHelper.currentTimestamp;
    }

    public save(): void
    {
        Emulator.gameScheduler.saveGroup(this);
    }

    public async saveNow(): Promise<void>
    {
        Emulator.gameScheduler.removeGroup(this);
        
        await getManager().save(this._entity);
    }

    public isOwner(user: User): boolean
    {
        if(!user) return false;

        if(this.userId === user.id) return true;

        if(user.hasPermission(PermissionList.ANY_GROUP_OWNER)) return true;

        return false;
    }

    public isAdmin(user: User): boolean
    {
        if(!user) return false;

        if(this.isOwner(user)) return true;

        if(user.hasPermission(PermissionList.ANY_GROUP_ADMIN)) return true;

        const rank = user.inventory.groups.getMembershipRank(this.id);

        if(rank === GroupRank.ADMIN) return true;

        return false;
    }

    public isPending(user: User): boolean
    {
        if(!user) return false;

        const rank = user.inventory.groups.getMembershipRank(this.id);

        if(rank === GroupRank.REQUESTED) return true;

        return false;
    }

    public async requestMembership(user: User): Promise<void>
    {
        if(!user) return;

        const membership = await this.getMembership(user);

        if(membership) return;

        if(this.state === GroupState.CLOSED) return;

        if(this.state === GroupState.OPEN)
        {
            const entity = await GroupDao.addMembership(this.id, user.id, GroupRank.MEMBER);

            if(!entity) return;

            const member = new GroupMember(entity, user);

            user.inventory.groups.addMembership(member);

            this._totalMembers++;

            if(user.unit && user.unit.room && user.unit.room.id === this.roomId) user.unit.loadRights();

            this.memberOutgoing(new GroupInfoComposer(this, false), new GroupMembersRefreshComposer(this.id));
        }

        else if(this.state === GroupState.LOCKED)
        {
            const entity = await GroupDao.addMembership(this.id, user.id, GroupRank.REQUESTED);

            if(!entity) return;

            const member = new GroupMember(entity, user);

            user.inventory.groups.addMembership(member);

            this._totalMembersPending++;

            if(user.unit && user.unit.room && user.unit.room.id === this.roomId) user.connections.processOutgoing(new GroupInfoComposer(this, false));

            this.adminOutgoing(new GroupInfoComposer(this, false), new GroupMembersRefreshComposer(this.id));
        }
    }

    public async acceptMember(user: User, targetId: number): Promise<void>
    {
        if(!user || !targetId) return;

        if(!this.isAdmin(user)) return;

        const target = await Emulator.gameManager.userManager.getOfflineUserById(targetId);

        if(!target) return;

        const membership = await this.getMembership(target);

        if(!membership) return;

        if(membership.rank !== GroupRank.REQUESTED) return;

        this._totalMembers++;
        this._totalMembersPending--;

        await membership.updateRank(GroupRank.MEMBER);

        if(target.unit && target.unit.room && target.unit.room.id === this.roomId) target.unit.loadRights();

        this.memberOutgoing(new GroupInfoComposer(this, false, true), new GroupMembersRefreshComposer(this.id));
    }

    public async removeMember(user: User, targetId: number): Promise<void>
    {
        if(!user || !targetId) return;

        if(!this.isAdmin(user))
        {
            if(user.id !== targetId) return;
        }

        const target = await Emulator.gameManager.userManager.getOfflineUserById(targetId);

        if(!target) return;

        const membership = await this.getMembership(target);

        if(!membership) return;

        if(membership.rank === GroupRank.OWNER) return;

        if(membership.rank === GroupRank.REQUESTED) this._totalMembersPending--;
        else this._totalMembers--;

        if(target.details.favoriteGroupId === this.id)
        {
            // remove favorite group
            // update badge in room?
        }

        await GroupDao.removeMembership(this.id, target.id);

        target.inventory.groups.removeMembership(membership);

        if(target.unit && target.unit.room && target.unit.room.id === this._entity.roomId)
        {
            target.unit.loadRights();

            target.connections.processOutgoing(new GroupInfoComposer(this, false), new GroupMembersRefreshComposer(this.id));
        }

        this.memberOutgoing(new GroupInfoComposer(this, false), new GroupMembersRefreshComposer(this.id));

        const room = await Emulator.gameManager.roomManager.getRoom(this._entity.roomId);

        if(!room) return;

        await room.init();

        const items = room.itemManager.getItemsByUser(target);

        if(items.length) room.itemManager.removeItem(target, ...items);
    }

    public async makeAdmin(user: User, targetId: number): Promise<void>
    {
        if(!user || !targetId) return;

        if(!this.isAdmin(user)) return;

        const target = await Emulator.gameManager.userManager.getOfflineUserById(targetId);

        if(!target) return;

        const membership = await this.getMembership(target);

        if(!membership) return;

        if(membership.rank === GroupRank.OWNER) return;

        await membership.updateRank(GroupRank.ADMIN);

        if(target.unit && target.unit.room && target.unit.room.id === this.roomId)
        {
            target.unit.loadRights();

            target.connections.processOutgoing(new GroupInfoComposer(this, false));
        }

        this.adminOutgoing(new GroupMemberComposer(membership));
    }

    public async removeAdmin(user: User, targetId: number): Promise<void>
    {
        if(!user || !targetId) return;

        if(!this.isAdmin(user)) return;

        const target = await Emulator.gameManager.userManager.getOfflineUserById(targetId);

        if(!target) return;

        const membership = await this.getMembership(target);

        if(!membership) return;

        if(membership.rank === GroupRank.OWNER) return;

        await membership.updateRank(GroupRank.MEMBER);

        if(target.unit && target.unit.room && target.unit.room.id === this.roomId)
        {
            target.unit.loadRights();

            target.connections.processOutgoing(new GroupInfoComposer(this, false));
        }

        this.adminOutgoing(new GroupMemberComposer(membership));
    }

    public async getMembers(pageId: number, search: string = null, adminOnly: boolean = false, requestsOnly: boolean = false): Promise<[GroupMemberEntity[], number]>
    {
        if(pageId === null) return null;

        const results = await GroupDao.getMembersByGroupId(this.id, pageId, search, adminOnly, requestsOnly);

        if(!results) return null;

        return results;
    }

    public async getMembership(user: User): Promise<GroupMember>
    {
        if(!user) return null;

        if(user.inventory.groups.isLoaded)
        {
            const membership = user.inventory.groups.getMembership(this.id);

            if(!membership) return null;

            return membership;
        }

        const result = await GroupDao.getMembershipByGroupId(this.id, user.id);

        if(!result) return null;

        const membership = new GroupMember(result, user);

        return membership;
    }

    public async loadPendingCount(): Promise<void>
    {
        const result = await GroupDao.getTotalPendingByGroupId(this.id);

        this._totalMembersPending = result || 0;
    }

    public addActiveMember(user: User): void
    {
        const totalActiveMembers = this._activeMembers.length;

        if(totalActiveMembers)
        {
            for(let i = 0; i < totalActiveMembers; i++)
            {
                const member = this._activeMembers[i];

                if(!member) continue;

                if(member !== user) continue;

                return;
            }
        }

        this._activeMembers.push(user);
    }

    public removeActiveMember(user: User): void
    {
        const totalActiveMembers = this._activeMembers.length;

        if(totalActiveMembers)
        {
            for(let i = 0; i < totalActiveMembers; i++)
            {
                const member = this._activeMembers[i];

                if(!member) continue;

                if(member !== user) continue;

                this._activeMembers.splice(i, 1);

                return;
            }
        }
    }

    public memberOutgoing(...outgoing: Outgoing[]): void
    {
        if(!outgoing) return;
        
        const totalActiveMembers = this._activeMembers.length;

        if(!totalActiveMembers) return;

        for(let i = 0; i < totalActiveMembers; i++)
        {
            const member = this._activeMembers[i];

            if(!member || !member.unit.room) continue;

            if(member.unit.room.id !== this._entity.roomId) continue;

            if(this.isPending(member)) continue;
            
            member.connections.processOutgoing(...outgoing);
        }
    }

    public adminOutgoing(...outgoing: Outgoing[]): void
    {
        if(!outgoing) return;
        
        const totalActiveMembers = this._activeMembers.length;

        if(!totalActiveMembers) return;

        for(let i = 0; i < totalActiveMembers; i++)
        {
            const member = this._activeMembers[i];

            if(!member || !member.unit.room) continue;

            if(!this.isAdmin(member)) continue;
            
            member.connections.processOutgoing(...outgoing);
        }
    }

    public setUser(user: User): void
    {
        if(!user) return;
        
        if(this.userId !== user.id)
        {
            this._entity.userId = user.id;

            this.save();
        }
    }

    public setRoom(room: Room): void
    {
        if(!room) return;
        
        if(this.roomId !== room.id)
        {
            this._entity.roomId = room.id;

            this.save();
        }
    }

    public clearRoom(): void
    {
        this._entity.roomId = null;

        this.save();
    }

    public parseSimpleInfo(packet: OutgoingPacket): OutgoingPacket
    {
        if(!packet) return null;

        this.updateLastAccess();

        return packet
            .writeInt(this.id)
            .writeString(this.name, this.badge);
    }

    public parseInfo(packet: OutgoingPacket, user: User, newWindow: boolean, isUpdate: boolean = false): OutgoingPacket
    {
        if(!user || !packet) return null;

        const rank = user.inventory.groups.getMembershipRank(this.id);

        this.updateLastAccess();

        return packet
            .writeInt(this.id)
            .writeBoolean(true)
            .writeInt(this.state) // state
            .writeString(this.name)
            .writeString(this.description)
            .writeString(this.badge)
            .writeInt(this.roomId)
            .writeString(this.roomName)
            .writeInt(rank === GroupRank.OWNER ? 4 : rank === GroupRank.ADMIN ? 3 : rank === GroupRank.REQUESTED ? 2 : rank === GroupRank.MEMBER ? 1 : 0) 
            .writeInt(this.totalMembers) // total members
            .writeBoolean(user.details.favoriteGroupId === this.id) // fav
            .writeString(TimeHelper.formatDate(this.timestampCreated, 'MMMM DD, YYYY'))
            .writeBoolean(this.isOwner(user))
            .writeBoolean(this.isAdmin(user))
            .writeString(this.userName)
            .writeBoolean(newWindow)
            .writeBoolean(this.memberRights)
            .writeInt(this.isAdmin(user) ? this.totalMembersPending : 0)
            .writeBoolean(this.forumEnabled);
    }

    private updateLastAccess(): void
    {
        this._lastAccess = TimeHelper.currentTimestamp;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get entity(): GroupEntity
    {
        return this._entity;
    }

    public get forum(): Forum
    {
        return this._forum;
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get userName(): string
    {
        return this._entity.user.username || null;
    }

    public get roomId(): number
    {
        return this._entity.roomId;
    }

    public get roomName(): string
    {
        return this._entity.room.name || null;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get description(): string
    {
        return this._entity.description;
    }

    public get badge(): string
    {
        return this._entity.badge;
    }

    public get colorOne(): number
    {
        return this._entity.colorOne;
    }

    public get colorTwo(): number
    {
        return this._entity.colorTwo;
    }

    public get state(): GroupState
    {
        return parseInt(<any> this._entity.state);
    }

    public get memberRights(): boolean
    {
        return this._entity.memberRights === '1';
    }

    public get forumEnabled(): boolean
    {
        return this._entity.forumEnabled === '1';
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }

    public get activeMembers(): User[]
    {
        return this._activeMembers;
    }

    public get totalMembers(): number
    {
        return this._totalMembers;
    }

    public set totalMembers(count: number)
    {
        this._totalMembers = count;
    }

    public get totalMembersPending(): number
    {
        return this._totalMembersPending;
    }

    public set totalMembersPending(count: number)
    {
        this._totalMembersPending = count;
    }

    public get lastAccess(): number
    {
        return this._lastAccess;
    }
}