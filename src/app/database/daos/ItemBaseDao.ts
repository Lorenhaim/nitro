import { getManager } from 'typeorm';
import { ItemBaseEntity } from '../entities';

export class ItemBaseDao
{
    public static async loadItems(): Promise<ItemBaseEntity[]>
    {
        const results = await getManager().find(ItemBaseEntity);

        if(results !== null) return results;

        return null;
    }
}