import { SecurityRankEntity } from '../../../database';
import { Emulator } from '../../../Emulator';
import { Permission } from '../permission';

export class Rank
{
    private _entity: SecurityRankEntity;
    private _permission: Permission;

    constructor(entity: SecurityRankEntity)
    {
        if(!(entity instanceof SecurityRankEntity)) throw new Error('invalid_entity');

        this._entity        = entity;
        this._permission    = null;

        if(this._entity.permissionId)
        {
            const permission = Emulator.gameManager.securityManager.permissionManager.getPermission(this._entity.permissionId);

            if(permission) this._permission = permission;
        }
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get permission(): Permission
    {
        return this._permission;
    }
}