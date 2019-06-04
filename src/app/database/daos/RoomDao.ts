import { getManager } from 'typeorm';
import { RoomEntity } from '../entities';

export class RoomDao
{
    public static async loadRoom(id: number): Promise<RoomEntity>
    {
        if(!id) return null;

        const result = await getManager()
            .createQueryBuilder(RoomEntity, 'room')
            .select(['room', 'group.id' ])
            .where('room.id = :id', { id })
            .leftJoin('room.group', 'group')
            .loadRelationCountAndMap('room.totalLikes', 'room.userLikes')
            .getOne();

        if(!result) return null;

        return result;
    }
}