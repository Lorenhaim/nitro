import { Manager } from '../../common';
import { GroupDao } from '../../database';
import { Group } from './Group';

export class GroupManager extends Manager
{
    private _groups: Group[];

    private _disposeInterval: NodeJS.Timeout;

    constructor()
    {
        super('GroupManager');

        this._groups            = [];

        this._disposeInterval   = null;
    }

    protected async onInit(): Promise<void>
    {
        this._disposeInterval = setInterval(() => this.tryDisposeAll(), 60000);
    }

    protected async onDispose(): Promise<void>
    {
        if(this._disposeInterval) clearInterval(this._disposeInterval);

        await this.removeAllGroups();
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

            group.updateLastAccess();

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

        await group.init();

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

    private async removeAllGroups(): Promise<void>
    {
        if(!this._groups.length) return;
        
        for(let i = this._groups.length - 1; i >= 0; i--) this.removeGroup(this._groups[i]);
    }

    public async removeGroup(group: Group): Promise<void>
    {
        if(!group) return;
        
        const totalGroups = this._groups.length;

        if(!totalGroups) return;
        
        for(let i = 0; i < totalGroups; i++)
        {
            const activeGroup = this._groups[i];

            if(!activeGroup) continue;

            if(activeGroup !== group) continue;

            await activeGroup.dispose();

            this._groups.splice(i, 1);

            return;
        }
    }

    private tryDisposeAll(): void
    {
        const totalGroups = this._groups.length;

        if(!totalGroups) return;

        for(let i = 0; i < totalGroups; i++)
        {
            const group = this._groups[i];

            if(!group) continue;

            group.tryDispose();
        }
    }
}