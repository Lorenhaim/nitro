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

    public static async getOwnerUsername(botId: number): Promise<string>
    {
        const result = await getManager()
            .createQueryBuilder(BotEntity, 'bot')
            .select(['bot.id', 'bot.userId', 'user.id', 'user.username' ])
            .where('bot.id = :botId', { botId })
            .innerJoin('bot.user', 'user')
            .getOne();

        if(result) return result.user.username;

        return null;
    }
}