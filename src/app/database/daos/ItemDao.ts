import { getManager } from 'typeorm';
import { ItemEntity, ItemTeleportsEntity } from '../entities';

export class ItemDao
{
    public static async getItem(itemId: number): Promise<ItemEntity>
    {
        const result = await getManager().findOne(ItemEntity, itemId);

        if(result) return result;

        return null;
    }

    public static async loadRoomItems(roomId: number): Promise<ItemEntity[]>
    {
        const results = await getManager().find(ItemEntity, {
            where: { roomId }
        });

        if(results) return results;

        return null;
    }

    public static async loadUserItems(userId: number): Promise<ItemEntity[]>
    {
        const results = await getManager().find(ItemEntity, {
            where: { userId, roomId: null }
        });

        if(results) return results;

        return null;
    }

    public static async getOwnerUsername(itemId: number): Promise<string>
    {
        const result = await getManager()
            .createQueryBuilder(ItemEntity, 'item')
            .select(['item.id', 'item.userId', 'user.id', 'user.username' ])
            .where('item.id = :itemId', { itemId })
            .innerJoin('item.user', 'user')
            .getOne();

        if(result) return result.user.username;

        return null;
    }

    public static async getTeleportPairing(teleportId: number): Promise<ItemTeleportsEntity>
    {
        const result = await getManager()
            .createQueryBuilder(ItemTeleportsEntity, 'teleport')
            .select(['teleport.id', 'teleport.teleportIdOne', 'teleport.teleportIdTwo', 'teleportOne.id', 'teleportOne.roomId', 'teleportTwo.id', 'teleportTwo.roomId' ])
            .where('teleport.teleportIdOne = :teleportId', { teleportId })
            .orWhere('teleport.teleportIdTwo = :teleportId', { teleportId })
            .innerJoin('teleport.teleportOne', 'teleportOne')
            .innerJoin('teleport.teleportTwo', 'teleportTwo')
            .getOne();

        if(result) return result;

        return null;
    }

    // public static async getTeleportPairing(teleportId: number): Promise<number>
    // {
    //     const result = await getManager().findOne(ItemTeleportsEntity, {
    //         where: [
    //             {
    //                 teleportIdOne: teleportId
    //             },
    //             {
    //                 teleportIdTwo: teleportId
    //             }
    //         ]
    //     });

    //     if(result)
    //     {
    //         if(result.teleportIdOne === teleportId) return result.teleportIdTwo;

    //         if(result.teleportIdTwo === teleportId) return result.teleportIdOne;
    //     }

    //     return null;
    // }

    public static async addTeleportLink(teleportIdOne: number, teleportIdTwo: number): Promise<void>
    {
        if(teleportIdOne && teleportIdTwo)
        {
            const entity = new ItemTeleportsEntity();

            entity.teleportIdOne    = teleportIdOne;
            entity.teleportIdTwo    = teleportIdTwo;

            await getManager().save(entity);
        }
    }

    public static async deleteItem(itemId: number): Promise<void>
    {
        await getManager().delete(ItemEntity, itemId);
    }
}