import { getManager } from 'typeorm';
import { PetEntity } from '../entities';

export class PetDao
{
    public static async loadRoomPets(roomId: number): Promise<PetEntity[]>
    {
        if(!roomId) return null;
        
        const results = await getManager().find(PetEntity, {
            where: { roomId }
        });

        if(results.length) return results;

        return null;
    }

    public static async loadUserPets(userId: number): Promise<PetEntity[]>
    {
        if(!userId) return null;
        
        const results = await getManager().find(PetEntity, {
            where: { userId, roomId: null }
        });

        if(results.length) return results;

        return null;
    }
}