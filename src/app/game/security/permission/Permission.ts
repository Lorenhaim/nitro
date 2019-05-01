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

    public hasPermission(permission: PermissionList | string): boolean
    {
        if(!permission) return true;
        
        permission = this._entity[permission.toString()];

        return permission !== undefined && permission === '1';
    }

    public get id(): number
    {
        return this._entity.id;
    }
}