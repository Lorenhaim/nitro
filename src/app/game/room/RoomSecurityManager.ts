import { Manager } from '../../common';
import { RoomRightsDao } from '../../database';
import { Nitro } from '../../Nitro';
import { Outgoing, RoomRightsListAddComposer, RoomRightsListRemoveComposer } from '../../packets';
import { GroupRank } from '../group';
import { PermissionList } from '../security';
import { User } from '../user';
import { Room } from './Room';

export class RoomSecurityManager extends Manager
{
    private _room: Room;

    private _rights: { id: number, username: string }[];

    constructor(room: Room)
    {
        super('RoomSecurityManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room      = room;

        this._rights    = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadRights();
    }

    protected async onDispose(): Promise<void>
    {
        this._rights = [];
    }

    public isOwner(user: User): boolean
    {
        if(!user) return false;

        if(this._room.details.ownerId === user.id || user.hasPermission(PermissionList.ANY_ROOM_OWNER)) return true;

        return false;
    }

    public isStrictOwner(user: User): boolean
    {
        if(!user) return false;

        if(this._room.details.ownerId === user.id) return true;

        return false;
    }

    public hasRights(user: User): boolean
    {
        if(!user) return false;

        if(this.isOwner(user)) return true;

        if(user.hasPermission(PermissionList.ANY_ROOM_RIGHTS)) return true;

        if(this._room.group && this._room.group.memberRights)
        {
            const rank = user.inventory.groups.getMembershipRank(this._room.group.id);

            if(rank !== null && rank !== GroupRank.REQUESTED) return true;
        }
        else
        {
            const totalRights = this._rights.length;

            if(!totalRights) return false;
            
            for(let i = 0; i < totalRights; i++)
            {
                const existingUser = this._rights[i];

                if(!existingUser) continue;

                if(existingUser.id === user.id) return true;
            }
        }

        return false;
    }

    public async giveRights(user: User, userId: number): Promise<void>
    {
        if(!user || !userId) return;

        if(this._room.group) return;

        if(!user.unit.isOwner()) return;

        const offlineUser = await Nitro.gameManager.userManager.getOfflineUserById(userId);

        if(!offlineUser) return;

        await RoomRightsDao.giveRights(this._room.id, userId);

        const right = { id: offlineUser.id, username: offlineUser.details.username };

        this._rights.push(right);

        this.ownersOutgoing(new RoomRightsListAddComposer(this._room, right));

        if(offlineUser.unit && offlineUser.unit.room === this._room) offlineUser.unit.loadRights();
    }

    public async removeAllRights(user: User): Promise<void>
    {
        if(!user) return;

        if(!user.unit.isOwner()) return;

        const totalRights = this._rights.length;

        if(!totalRights) return;

        for(let i = 0; i < totalRights; i++)
        {
            const right = this._rights[i];

            if(!right) continue;

            this._rights.splice(i, 1);

            this.ownersOutgoing(new RoomRightsListRemoveComposer(this._room, right.id));

            const user = Nitro.gameManager.userManager.getUserById(right.id);

            if(!user) continue;

            if(!user.unit || user.unit.room !== this._room) continue;
                
            user.unit.loadRights();
        }

        await RoomRightsDao.removeAllRights(this._room.id);
    }

    public async removeRights(user: User, ...userIds: number[]): Promise<void>
    {
        if(!user || !userIds) return;

        const ids = [ ...userIds ];

        const totalIds = ids.length;

        if(!totalIds) return;

        const totalRights = this._rights.length;

        if(!totalRights) return;

        if(!user.unit.isOwner() && totalIds !== 1 && ids[0] !== user.id) return;

        const validatedIds: number[] = [];

        for(let i = 0; i < totalIds; i++)
        {
            const userId = ids[i];

            if(!userId) continue;

            for(let j = 0; j < totalRights; j++)
            {
                const right = this._rights[j];

                if(!right) continue;

                if(right.id !== userId) continue;

                validatedIds.push(userId);

                this._rights.splice(j, 1);

                this.ownersOutgoing(new RoomRightsListRemoveComposer(this._room, userId));

                const user = Nitro.gameManager.userManager.getUserById(userId);

                if(!user) continue;

                if(!user.unit || user.unit.room !== this._room) continue;
                
                user.unit.loadRights();

                break;
            }
        }

        if(validatedIds.length) await RoomRightsDao.removeRights(this._room.id, ...validatedIds);
    }

    public rightsOutgoing(...outgoing: Outgoing[]): void
    {
        if(!outgoing) return;

        const activeUnits = this._room.unitManager.units;

        if(!activeUnits) return;
        
        const totalActiveUnits = activeUnits.length;

        if(!totalActiveUnits) return;

        for(let i = 0; i < totalActiveUnits; i++)
        {
            const unit = activeUnits[i];

            if(!unit) continue;

            if(!unit.hasRights()) continue;

            unit.user.connections.processOutgoing(...outgoing);
        }
    }

    public ownersOutgoing(...outgoing: Outgoing[]): void
    {
        if(!outgoing) return;

        const activeUnits = this._room.unitManager.units;

        if(!activeUnits) return;
        
        const totalActiveUnits = activeUnits.length;

        if(!totalActiveUnits) return;

        for(let i = 0; i < totalActiveUnits; i++)
        {
            const unit = activeUnits[i];

            if(!unit) continue;

            if(!unit.isOwner()) continue;

            unit.user.connections.processOutgoing(...outgoing);
        }
    }

    private async loadRights(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._rights = [];

        const results = await RoomRightsDao.loadRights(this._room.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            this._rights.push({ id: result.user.id, username: result.user.username });
        }
    }

    public get room(): Room
    {
        return this._room;
    }

    public get rights(): { id: number, username: string }[]
    {
        return this._rights;
    }
}