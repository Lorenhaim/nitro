import { Manager, TimeHelper } from '../../common';
import { GroupDao } from '../../database';
import { Group } from './Group';

export class GroupManager extends Manager
{
    private _groups: Group[];

    constructor()
    {
        super('GroupManager');

        this._groups = [];
    }

    protected async onInit(): Promise<void> {}

    protected async onDispose(): Promise<void>
    {
        await this.cleanup(true);
    }

    public async getGroup(groupId: number): Promise<Group>
    {
        if(!groupId) return null;
        
        let group = this.getActiveGroup(groupId);

        if(group) return group;

        return await this.getOfflineGroup(groupId);
    }

    public getActiveGroup(groupId: number): Group
    {
        const totalGroups = this._groups.length;

        if(!totalGroups) return null;

        for(let i = 0; i < totalGroups; i++)
        {
            const group = this._groups[i];

            if(!group) continue;

            if(group.id !== groupId) continue;

            return group;
        }

        return null;
    }

    private async getOfflineGroup(groupId: number): Promise<Group>
    {
        if(!groupId) return null;

        const entity = await GroupDao.getGroupById(groupId);

        if(!entity) return null;

        const group = new Group(entity);

        if(!group) return null;

        await group.loadPendingCount();

        return this.addGroup(group);
    }

    private addGroup(group: Group): Group
    {
        if(!(group instanceof Group)) return null;

        let instance = this.getActiveGroup(group.id);

        if(instance) return instance;

        this._groups.push(group);

        return group;
    }

    public hasGroup(groupId: number): boolean
    {
        return this.getActiveGroup(groupId) !== null;
    }

    public async cleanup(force: boolean = false): Promise<void>
    {
        const totalGroups = this._groups.length;

        if(!totalGroups) return;

        const allowedElapsed = TimeHelper.currentTimestamp - 30000;

        for(let i = 0; i < totalGroups; i++)
        {
            const group = this._groups[i];

            if(!group) continue;

            if(!force)
            {
                if(group.activeMembers.length > 0) continue;
                
                if(group.lastAccess < allowedElapsed) continue;
            }

            await group.saveNow();

            this._groups.splice(i, 1);
        }
    }
}