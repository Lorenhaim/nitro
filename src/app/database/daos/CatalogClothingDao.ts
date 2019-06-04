import { getManager } from 'typeorm';
import { CatalogClothingEntity } from '../entities/CatalogClothingEntity';

export class CatalogClothingDao
{
    public static async loadAllClothing(): Promise<CatalogClothingEntity[]>
    {
        const results = await getManager().find(CatalogClothingEntity);

        if(results.length ) return results;

        return null;
    }
}