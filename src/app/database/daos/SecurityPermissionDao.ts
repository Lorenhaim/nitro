import { getManager } from 'typeorm';
import { SecurityPermissionEntity } from '../entities';

export class SecurityPermissionDao
{
    public static async loadPermissions(): Promise<SecurityPermissionEntity[]>
    {
        const results = await getManager().find(SecurityPermissionEntity);

        if(results !== null) return results;

        return null;
    }
}