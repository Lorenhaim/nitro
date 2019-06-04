import { getManager } from 'typeorm';
import { UserClothingEntity } from '../entities';

export class UserClothingDao
{
    public static async addUserClothing(userId: number, clothingId: number): Promise<UserClothingEntity>
    {
        if(!userId || !clothingId) return;

        const entity = new UserClothingEntity();

        entity.userId       = userId;
        entity.clothingId   = clothingId;

        await getManager().save(entity);

        return entity;
    }

    public static async loadUserClothing(userId: number): Promise<UserClothingEntity[]>
    {
        if(!userId) return;
        
        const results = await getManager().find(UserClothingEntity, {
            where: { userId }
        });

        if(results.length) return results;

        return null;
    }
}