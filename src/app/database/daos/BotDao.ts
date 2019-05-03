import { getManager } from 'typeorm';
import { BotEntity } from '../entities';

export class BotDao
{
    public static async loadRoomBots(roomId: number): Promise<BotEntity[]>
    {
        if(!roomId) return null;
        
        const results = await getManager().find(BotEntity, {
            where: { roomId }
        });

        if(results.length) return results;

        return null;
    }

    public static async loadUserBots(userId: number): Promise<BotEntity[]>
    {
        if(!userId) return null;
        
        const results = await getManager().find(BotEntity, {
            where: { userId, roomId: null }
        });

        if(results.length) return results;

        return null;
    }
}