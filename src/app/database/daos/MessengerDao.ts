import { getManager } from 'typeorm';
import { MessengerCategoryEntity, MessengerFriendEntity, MessengerRequestEntity } from '../entities';

export class MessengerDao
{
    public static async loadCategories(userId: number): Promise<MessengerCategoryEntity[]>
    {
        if(!userId) return;
        
        const results = await getManager().find(MessengerCategoryEntity, {
            where: { userId }
        });

        if(results.length) return results;

        return null;
    }
    
    public static async loadFriends(userId: number): Promise<MessengerFriendEntity[]>
    {
        if(!userId) return;

        const results = await getManager()
            .createQueryBuilder(MessengerFriendEntity, 'friendship')
            .select(['friendship.id', 'friendship.userId', 'friendship.friendId', 'friendship.categoryId', 'friendship.relation', 'friend.id', 'friend.username', 'friend.motto', 'friend.gender', 'friend.figure', 'friend.online' ])
            .where('friendship.userId = :userId', { userId })
            .innerJoin('friendship.friend', 'friend')
            .getMany();

        if(results.length) return results;

        return null;
    }

    public static async loadRequests(userId: number): Promise<MessengerRequestEntity[]>
    {
        if(!userId) return;

        const results = await getManager()
            .createQueryBuilder(MessengerRequestEntity, 'request')
            .select(['request.id', 'request.userId', 'request.requestedId', 'user.id', 'user.username', 'user.figure' ])
            .where('request.requestedId = :userId', { userId })
            .innerJoin('request.user', 'user')
            .getMany();

        if(results.length) return results;

        return null;
    }

    public static async loadRequestsSent(userId: number): Promise<MessengerRequestEntity[]>
    {
        if(!userId) return;

        const results = await getManager().find(MessengerRequestEntity, {
            select: ['id', 'requestedId'],
            where: { userId }
        });

        if(results.length) return results;

        return null;
    }

    public static async removeFriend(userId: number, friendId: number): Promise<void>
    {
        if(!userId || !friendId) return;
        
        await getManager().delete(MessengerFriendEntity, {
            userId,
            friendId
        });

        await getManager().delete(MessengerFriendEntity, {
            userId: friendId,
            friendId: userId
        });
    }

    public static async updateRelation(userId: number, friendId: number, relation: 0 | 1 | 2 | 3): Promise<void>
    {
        if(!userId || !friendId || relation < 0 || relation > 3) return;

        await getManager().update(MessengerFriendEntity, {
            userId,
            friendId
        }, {
            relation
        });
    }

    public static async removeRequest(userId: number, requestedId: number): Promise<void>
    {
        if(!userId || !requestedId) return;
        
        await getManager().delete(MessengerRequestEntity, {
            userId,
            requestedId
        });

        await getManager().delete(MessengerRequestEntity, {
            userId: requestedId,
            requestedId: userId
        });
    }

    public static async removeAllRequests(userId: number): Promise<void>
    {
        if(!userId) return;
        
        await getManager().delete(MessengerRequestEntity, {
            requestedId: userId
        });
    }
}