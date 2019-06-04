import { Manager } from '../../../common';
import { SecurityPermissionDao } from '../../../database';
import { Permission } from './Permission';

export class PermissionManager extends Manager
{
    private _permissions: Permission[];

    constructor()
    {
        super('PermissionManager');
    }

    protected async onInit(): Promise<void>
    {
        await this.loadPermissions();
    }

    protected async onDispose(): Promise<void>
    {
        this._permissions = [];
    }

    private async loadPermissions(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._permissions = [];
        
        const results = await SecurityPermissionDao.loadPermissions();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._permissions.push(new Permission(results[i]));
        }

        this.logger.log(`Loaded ${ this._permissions.length } permissions`);
    }

    public getPermission(id: number): Permission
    {
        const totalPermissions = this._permissions.length;

        if(totalPermissions)
        {
            for(let i = 0; i < totalPermissions; i++)
            {
                const permission = this._permissions[i];

                if(permission.id === id) return permission;
            }
        }

        return null;
    }
}