import { Manager } from '../../common';
import { CatalogClothingDao, CatalogItemDao, CatalogPageDao } from '../../database';
import { Nitro } from '../../Nitro';
import { CatalogModeComposer, CatalogUpdatedComposer, DiscountConfigComposer, GiftConfigComposer, MarketplaceConfigComposer, RecyclerPrizesComposer } from '../../packets';
import { CatalogItem } from './CatalogItem';
import { CatalogPage } from './CatalogPage';
import { CatalogLayout, CatalogLayouts, ClubBuyLayout, DefaultLayout, FrontPageFeaturedLayout, FrontPageLayout, GroupFrontpageLayout, GroupFurniLayout, SpacesNewLayout } from './layouts';
import { PetInfoLayout } from './layouts/PetInfoLayout';

export class CatalogManager extends Manager
{
    private _layouts: CatalogLayout[];
    private _pages: CatalogPage[];
    private _items: CatalogItem[];

    private _clothing: { name: string, ids: number[] }[];
    private _clothingIds: number[];

    constructor()
    {
        super('CatalogManager');

        this._layouts       = [];
        this._pages         = [];
        this._items         = [];

        this._clothing      = [];
        this._clothingIds   = [];
    }

    protected async onInit(): Promise<void>
    {
        this.loadLayouts();

        await this.loadPages();
        await this.loadItems();
        await this.loadClothing();
    }

    protected async onDispose(): Promise<void>
    {
        this._layouts       = [];
        this._pages         = [];
        this._items         = [];

        this._clothing      = [];
        this._clothingIds   = [];
    }

    public getPage(id: number, rankId: number = null): CatalogPage
    {
        const totalPages = this._pages.length;

        if(!totalPages) return null;
        
        for(let i = 0; i < totalPages; i++)
        {
            const page = this._pages[i];

            if(!page) continue;

            if(page.minRank && page.minRank > rankId) continue;

            if(page.id === id) return page;
        }

        return null;
    }

    public getLayout(name: CatalogLayouts): CatalogLayout
    {
        const totalLayouts = this._layouts.length;

        if(!totalLayouts) return null;

        for(let i = 0; i < totalLayouts; i++)
        {
            const layout = this._layouts[i];

            if(layout.name === name) return layout;
        }

        return null;
    }

    public getPages(parentId: number = 0, rankId: number = null): CatalogPage[]
    {
        const totalPages = this._pages.length;

        if(!totalPages) return null;
        
        const results: CatalogPage[] = [];
            
        for(let i = 0; i < totalPages; i++)
        {
            const page = this._pages[i];

            if(!page) continue;

            if(page.minRank && page.minRank > rankId) continue;

            if(page.parentId === null && parentId === 0) results.push(page);

            else if(page.parentId === parentId) results.push(page);
        }

        if(results.length) return results;

        return null;
    }

    public getItem(itemId: number): CatalogItem
    {
        if(!itemId) return null;
        
        const totalItems = this._items.length;

        if(!totalItems) return null;
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(item.id === itemId) return item;
        }

        return null;
    }

    public getItems(pageId: number): CatalogItem[]
    {
        if(!pageId) return null;
        
        const totalItems = this._items.length;

        if(!totalItems) return null;
        
        const results: CatalogItem[] = [];
                
        for(let i = 0; i < totalItems; i++)
        {
            const item = this._items[i];

            if(item.pageId === pageId) results.push(item);
        }

        if(results.length) return results;

        return null;
    }

    public getClothingIds(name: string): number[]
    {
        if(!name) return null;
        
        const totalClothing = this._clothing.length;

        if(!totalClothing) return null;
        
        for(let i = 0; i < totalClothing; i++)
        {
            const clothing = this._clothing[i];

            if(clothing.name === name) return clothing.ids;
        }

        return null;
    }

    private loadLayouts(): void
    {
        this._layouts.push(new DefaultLayout());
        this._layouts.push(new FrontPageLayout());
        this._layouts.push(new FrontPageFeaturedLayout());
        this._layouts.push(new SpacesNewLayout());
        this._layouts.push(new ClubBuyLayout());
        this._layouts.push(new GroupFrontpageLayout());
        this._layouts.push(new PetInfoLayout());
        this._layouts.push(new GroupFurniLayout());

        this.logger.log(`Loaded ${ this._layouts.length } layouts`);
    }

    private async loadPages(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._pages = [];

        const results = await CatalogPageDao.loadAllPages();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const entity = results[i];
                    
                    this._pages.push(new CatalogPage(entity));
                }
            }
        }

        this.logger.log(`Loaded ${ this._pages.length } pages`);
    }

    private async loadItems(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._items = [];

        const results = await CatalogItemDao.loadAllItems();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const entity = results[i];

                    const page = this.getPage(entity.pageId);

                    if(page)
                    {
                        if(entity.offerId) page.offerIds.push(entity.offerId);

                        const item = new CatalogItem(entity, page);

                        if(item.isLimited) await item.generateLimitedNumbers();

                        this._items.push(item);
                    }
                }
            }
        }

        this.logger.log(`Loaded ${ this._items.length } items`);
    }

    private async loadClothing(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._clothing      = [];
        this._clothingIds   = [];

        const results = await CatalogClothingDao.loadAllClothing();

        if(results)
        {
            const totalResults = results.length;

            if(totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const entity = results[i];

                    const figureIds = entity.figureIds;

                    if(!figureIds) continue;

                    const parts = figureIds.split(',');

                    if(!parts) continue;

                    const totalParts = parts.length;

                    if(!totalParts) continue;

                    const validatedParts: number[] = [];

                    for(let j = 0; j < totalParts; j++)
                    {
                        const part = parts[j];

                        if(!part) continue;

                        this._clothingIds.push(parseInt(part));

                        validatedParts.push(parseInt(part));
                    }

                    this._clothing.push({ name: entity.name, ids: validatedParts });
                }
            }
        }

        this.logger.log(`Loaded ${ this._clothing.length } clothing sets`);
    }

    public notifyReload(): void
    {
        return Nitro.gameManager.userManager.processOutgoing(
            new CatalogUpdatedComposer(),
            new CatalogModeComposer(0),
            new DiscountConfigComposer(),
            new MarketplaceConfigComposer(),
            new GiftConfigComposer(),
            new RecyclerPrizesComposer());
    }

    public get pages(): CatalogPage[]
    {
        return this._pages;
    }

    public get items(): CatalogItem[]
    {
        return this._items;
    }

    public get clothing(): { name: string, ids: number[] }[]
    {
        return this._clothing;
    }

    public get clothingIds(): number[]
    {
        return this._clothingIds;
    }
}