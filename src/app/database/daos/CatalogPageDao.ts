import { getManager } from 'typeorm';
import { CatalogPageEntity } from '../entities';

export class CatalogPageDao
{
    public static async loadAllPages(): Promise<CatalogPageEntity[]>
    {
        const results = await getManager().find(CatalogPageEntity, {
            order: {
                name: 'ASC'
            }
        });

        if(results) return results;

        return null;
    }
}