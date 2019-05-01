import { getManager } from 'typeorm';
import { RoomEntity } from '../entities';

export class RoomDao
{
    public static async loadRoom(id: number): Promise<RoomEntity>
    {
        if(id)
        {
            const result = await getManager().findOne(RoomEntity, id);

            if(result) return result;
        }

        return null;
    }
    
    public static async loadDetailsById(id: number): Promise<RoomEntity>
    {
        if(id > 0)
        {
            const result = await getManager().findOne(RoomEntity, id);

            if(result !== null) return result;
        }

        return null;
    }
}