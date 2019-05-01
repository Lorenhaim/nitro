import { getManager } from 'typeorm';
import { Outfit } from '../../game';
import { UserOutfitEntity } from '../entities';

export class UserOutfitDao
{
    public static async loadUserOutfits(userId: number): Promise<UserOutfitEntity[]>
    {
        if(userId > 0)
        {
            const results = await getManager().find(UserOutfitEntity, {
                where: { userId }
            });

            if(results !== null) return results;
        }

        return null;
    }

    public static async addOutfit(outfit: Outfit): Promise<UserOutfitEntity>
    {
        const entity = new UserOutfitEntity();

        entity.userId     = outfit.userId || 0;
        entity.figure     = outfit.figure || null,
        entity.gender     = outfit.gender === 'M' ? 'M' : 'F',
        entity.slotNumber = outfit.slotNumber || 0

        if(entity.userId > 0 && entity.figure !== null && entity.gender !== null && entity.slotNumber > 0)
        {
            await this.removeOutfit(entity.userId, entity.slotNumber);

            await getManager().save(entity);

            return entity;
        }

        return null;
    }

    public static async removeOutfit(userId: number, slotNumber: number): Promise<void>
    {
        if(userId > 0 && slotNumber > 0)
        {
            await getManager().delete(UserOutfitEntity, {
                userId,
                slotNumber
            });
        }
    }
}