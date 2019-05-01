import { getManager, In } from 'typeorm';
import { RoomRightsEntity } from '../entities';

export class RoomRightsDao
{
    public static async loadRights(roomId: number): Promise<RoomRightsEntity[]>
    {
        if(!roomId) return null;
        
        const results = await getManager()
            .createQueryBuilder(RoomRightsEntity, 'roomRights')
            .select(['roomRights.id', 'roomRights.userId', 'roomRights.roomId', 'user.id', 'user.username' ])
            .where('roomRights.roomId = :roomId', { roomId })
            .innerJoin('roomRights.user', 'user')
            .getMany();

        if(results.length) return results;

        return null;
    }

    public static async giveRights(roomId: number, userId: number): Promise<void>
    {
        if(!roomId || !userId) return;
        
        const rights = new RoomRightsEntity();

        rights.roomId = roomId;
        rights.userId = userId;

        await getManager().save(rights);
    }

    public static async removeRights(roomId: number, ...userIds: number[]): Promise<void>
    {
        if(!roomId || !userIds) return;
        
        const ids = [ ...userIds ];

        if(ids.length) await getManager().delete(RoomRightsEntity, { roomId, userId: In(ids) });
    }

    public static async removeAllRights(roomId: number): Promise<void>
    {
        if(!roomId) return;

        await getManager().delete(RoomRightsEntity, { roomId });
    }
}