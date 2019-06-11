import { Manager } from '../../../../common';
import { GroupDao } from '../../../../database';
import { Nitro } from '../../../../Nitro';
import { Group, GroupMember, GroupRank } from '../../../group';
import { User } from '../../User';

export class UserGroups extends Manager
{
    private _user: User;
    private _memberships: GroupMember[];

    constructor(user: User)
    {
        super('UserGroups', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;
        this._memberships   = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadMemberships();
    }

    protected async onDispose(): Promise<void>
    {
        const totalMemberships = this._memberships.length;

        if(!totalMemberships) return;

        for(let i = 0; i < totalMemberships; i++)
        {
            const membership = this._memberships[i];

            if(!membership) continue;

            const group = Nitro.gameManager.groupManager.getActiveGroup(membership.groupId);

            if(!group) continue;

            if(this._user.connections.isConnected) group.removeActiveMember(this._user);

            this._memberships.splice(i, 1);
        }
    }

    public getMembership(groupId: number): GroupMember
    {
        const totalMemberships = this._memberships.length;

        if(!totalMemberships) return null;

        for(let i = 0; i < totalMemberships; i++)
        {
            const membership = this._memberships[i];

            if(membership.groupId !== groupId) continue;

            return membership;
        }

        return null;
    }

    public getMembershipRank(groupId: number): GroupRank
    {
        const membership = this.getMembership(groupId);

        if(!membership) return null;

        return membership.rank;
    }

    public hasMembership(groupId: number): boolean
    {
        return this.getMembership(groupId) !== null;
    }

    public hasValidMembership(groupId: number): boolean
    {
        const rank = this.getMembershipRank(groupId);

        if(rank === null || rank === GroupRank.REQUESTED) return false;

        return true;
    }

    public getGroups(): Group[]
    {
        const totalMemberships = this._memberships.length;

        if(!totalMemberships) return null;

        const results: Group[] = [];

        for(let i = 0; i < totalMemberships; i++)
        {
            const membership = this._memberships[i];

            if(!membership) continue;

            const group = Nitro.gameManager.groupManager.getActiveGroup(membership.groupId);

            if(!group) continue;

            results.push(group);
        }

        if(!results.length) return null;

        return results;
    }

    public addMembership(...memberships: GroupMember[]): void
    {
        const addedMemberships = [ ...memberships ];

        if(!addedMemberships) return;
        
        const totalMemberships = addedMemberships.length;

        if(!totalMemberships) return;
        
        for(let i = 0; i < totalMemberships; i++)
        {
            const membership = addedMemberships[i];

            if(this.hasMembership(membership.groupId)) continue;

            const group = Nitro.gameManager.groupManager.getActiveGroup(membership.groupId);

            if(!group) continue;

            if(this._user.connections.isConnected) group.addActiveMember(this._user);

            this._memberships.push(membership);

            return;
        }
    }

    public removeMembership(...memberships: GroupMember[]): void
    {
        const removedMemberships = [ ...memberships ];

        if(!removedMemberships) return;
        
        const totalRemovedMemberships = removedMemberships.length;

        if(!totalRemovedMemberships) return;
        
        for(let i = 0; i < totalRemovedMemberships; i++)
        {
            const membership = removedMemberships[i];

            if(!membership) continue;

            if(!this.hasMembership(membership.groupId)) continue;

            const totalMemberships = this._memberships.length;

            if(!totalMemberships) continue;

            for(let j = 0; j < totalMemberships; j++)
            {
                const activeMembership = this._memberships[j];

                if(!activeMembership) continue;

                if(activeMembership !== membership) continue;

                const group = Nitro.gameManager.groupManager.getActiveGroup(membership.groupId);

                if(group && this._user.connections.isConnected) group.removeActiveMember(this._user);

                this._memberships.splice(j, 1);

                break;
            }
        }
    }

    private async loadMemberships(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._memberships = [];

        const results = await GroupDao.getMembershipsByUserId(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;

        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            const group = await Nitro.gameManager.groupManager.getGroup(result.groupId);

            if(!group) continue;

            if(this._user.connections.isConnected) group.addActiveMember(this._user);

            this._memberships.push(new GroupMember(result, this._user));
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get memberships(): GroupMember[]
    {
        return this._memberships;
    }
}