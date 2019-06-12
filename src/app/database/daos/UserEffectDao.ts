import { getManager } from 'typeorm';
import { UserEffectEntity } from '../entities';

export class UserEffectDao
{
    public static async loadUserEffects(userId: number): Promise<UserEffectEntity[]>
    {
        if(!userId) return;
        
        const results = await getManager().find(UserEffectEntity, {
            where: { userId }
        });

        if(!results.length) return null;

        return results;
    }
}