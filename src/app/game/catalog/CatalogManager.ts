import { Manager } from '../../common';
import { CatalogItemDao, CatalogPageDao } from '../../database';
import { CatalogItem } from './CatalogItem';
import { CatalogPage } from './CatalogPage';
import { CatalogLayout, CatalogLayouts, DefaultLayout, FrontPageFeaturedLayout, FrontPageLayout, SpacesNewLayout } from './layouts';

export class CatalogManager extends Manager
{
    private _layouts: CatalogLayout[];
    private _pages: CatalogPage[];
    private _items: CatalogItem[];

    constructor()
    {
        super('CatalogManager');

        this._layouts   = [];
        this._pages     = [];
        this._items     = [];
    }

    protected async onInit(): Promise<void>
    {
        this.loadLayouts();

        await this.loadPages();
        await this.loadItems();
    }

    protected async onDispose(): Promise<void>
    {
        this._layouts   = [];
        this._pages     = [];
        this._items     = [];
    }

    public getPage(id: number): CatalogPage
    {
        const totalPages = this._pages.length;

        if(totalPages)
        {
            for(let i = 0; i < totalPages; i++)
            {
                const page = this._pages[i];

                if(page.id === id) return page;
            }
        }

        return null;
    }

    public getLayout(name: CatalogLayouts): CatalogLayout
    {
        const totalLayouts = this._layouts.length;

        if(totalLayouts)
        {
            for(let i = 0; i < totalLayouts; i++)
            {
                const layout = this._layouts[i];

                if(layout.name === name) return layout;
            }
        }

        return null;
    }

    public getPages(parentId: number = 0): CatalogPage[]
    {
        const totalPages = this._pages.length;

        if(totalPages)
        {
            const results: CatalogPage[] = [];
            
            for(let i = 0; i < totalPages; i++)
            {
                const page = this._pages[i];

                if(page.parentId === null && parentId === 0) results.push(page);

                else if(page.parentId === parentId) results.push(page);
            }

            if(results.length) return results;
        }

        return null;
    }

    public getItem(itemId: number): CatalogItem
    {
        if(itemId)
        {
            const totalItems = this._items.length;

            if(totalItems)
            {
                const results: CatalogItem[] = [];
                
                for(let i = 0; i < totalItems; i++)
                {
                    const item = this._items[i];

                    if(item.id === itemId) return item;
                }
            }
        }

        return null;
    }

    public getItems(pageId: number): CatalogItem[]
    {
        if(pageId)
        {
            const totalItems = this._items.length;

            if(totalItems)
            {
                const results: CatalogItem[] = [];
                
                for(let i = 0; i < totalItems; i++)
                {
                    const item = this._items[i];

                    if(item.pageId === pageId) results.push(item);
                }

                if(results.length) return results;
            }
        }

        return null;
    }

    private loadLayouts(): void
    {
        this._layouts.push(new DefaultLayout());
        this._layouts.push(new FrontPageLayout());
        this._layouts.push(new FrontPageFeaturedLayout());
        this._layouts.push(new SpacesNewLayout());

        this.logger.log(`Loaded ${ this._layouts.length } layouts`);
    }

    private async loadPages(): Promise<void>
    {
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

    public get pages(): CatalogPage[]
    {
        return this._pages;
    }

    public get items(): CatalogItem[]
    {
        return this._items;
    }
}