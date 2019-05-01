import { getManager, MoreThan } from 'typeorm';
import { CatalogItemEntity, CatalogItemLimitedEntity } from '../entities';

export class CatalogItemDao
{
    public static async loadAllItems(): Promise<CatalogItemEntity[]>
    {
        const results = await getManager().find(CatalogItemEntity, {
            order: {
                productName: 'ASC'
            }
        });

        if(results) return results;

        return null;
    }

    public static async getLimitedSells(catalogItemId: number): Promise<CatalogItemLimitedEntity[]>
    {
        if(catalogItemId)
        {
            const results = await getManager().find(CatalogItemLimitedEntity, {
                where: { 
                    catalogItemId,
                    userId: MoreThan(0)
                }
            });

            if(results.length) return results;
        }

        return null;
    }

    public static async getLimitedRemaining(id: number): Promise<number>
    {
        if(id)
        {
            const result = await getManager().findOne(CatalogItemEntity, id);

            if(result) return result.limitedStack - result.limitedSells;
        }

        return 0;
    }

    public static async addLimitedPurchase(userId: number, baseId: number, catalogItemId: number, itemId: number, limitedNumber: number): Promise<void>
    {
        if(userId && baseId && catalogItemId && itemId && limitedNumber)
        {
            const entity = new CatalogItemLimitedEntity();

            entity.userId           = userId;
            entity.baseId           = baseId;
            entity.catalogItemId    = catalogItemId;
            entity.itemId           = itemId;
            entity.limitedNumber    = limitedNumber;

            // const result = await getManager().findOne(CatalogItemEntity, catalogItemId);

            // // if(result)
            // // {

            // // }

            // // await getManager().update(CatalogItemEntity, {
            // //     limitedSells
            // // }
            // // })

            await getManager().save(entity);
        }
    }
}