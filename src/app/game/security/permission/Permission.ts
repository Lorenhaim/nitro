import { SecurityPermissionEntity } from '../../../database';
import { PermissionList } from './PermissionList';

export class Permission
{
    private _entity: SecurityPermissionEntity;

    constructor(entity: SecurityPermissionEntity)
    {
        if(!(entity instanceof SecurityPermissionEntity)) throw new Error('invalid_entity');

        this._entity = entity;
    }

    public hasAllPermissions(): boolean
    {
        if(this._entity.allPermissions === '1') return true;

        return false;
    }

    public hasPermission(permission: PermissionList | string): boolean
    {
        if(!permission) return false;
        
        permission = this._entity[permission.toString()];

        if(permission === undefined || !permission) return false;

        if(this.hasAllPermissions()) return true;

        return permission === '1';
    }

    public get id(): number
    {
        return this._entity.id;
    }
}