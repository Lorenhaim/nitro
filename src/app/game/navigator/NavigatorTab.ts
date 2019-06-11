import { TimeHelper } from '../../common';
import { NavigatorTabEntity } from '../../database';
import { Nitro } from '../../Nitro';
import { NavigatorListCollapsed, NavigatorListMode } from './list';
import { NavigatorCategory } from './NavigatorCategory';
import { NavigatorSearchAction, NavigatorSearchResult } from './search';

export class NavigatorTab
{
    private _entity: NavigatorTabEntity;
    private _categories: NavigatorCategory[];
    private _categoryIds: number[];
    private _includes: string[];

    private _searchResults: NavigatorSearchResult[];

    private _isUpdating: boolean;
    private _lastUpdated: Date;

    constructor(entity: NavigatorTabEntity)
    {
        if(!(entity instanceof NavigatorTabEntity)) throw new Error('invalid_tab');

        this._entity        = entity;
        this._categories    = [];
        this._categoryIds   = [];
        this._includes      = [];

        this._searchResults = [];

        this._isUpdating    = false;
        this._lastUpdated   = null;

        this.loadCategories();
        this.loadIncludes();
    }

    private loadCategories(): void
    {
        this._categories = [];

        const categoryIds = this._entity.categoryIds;

        if(categoryIds)
        {
            const parts = categoryIds.split(',');

            if(parts)
            {
                const totalParts = parts.length;

                if(totalParts)
                {
                    for(let i = 0; i < totalParts; i++)
                    {
                        const category = Nitro.gameManager.navigatorManager.getCategory(parseInt(parts[i]));

                        if(category)
                        {
                            this._categories.push(category);
                            this._categoryIds.push(category.id);
                        }
                    }
                }
            }
        }
    }

    private loadIncludes(): void
    {
        this._includes = [];

        const includes = this._entity.includes;

        if(includes) this._includes = includes.split(',');
    }

    public async loadSearchResults(): Promise<void>
    {
        if(!this._isUpdating)
        {
            this._isUpdating = true;

            this._searchResults = [];

            const totalIncludes = this._includes.length;

            if(totalIncludes)
            {
                for(let i = 0; i < totalIncludes; i++)
                {
                    const include = this._includes[i];

                    if(include === 'popularNow')
                    {                        
                        const searchResult = new NavigatorSearchResult(this, `popularNow:popularNow`, NavigatorSearchAction.NONE, {
                            collapsed: NavigatorListCollapsed.FALSE,
                            mode: NavigatorListMode.LIST,
                            showHidden: false
                        });

                        await searchResult.loadResults();

                        if(searchResult.rooms.length) this._searchResults.push(searchResult);
                    }
                }
            }
            
            const totalCategories = this._categories.length;

            if(totalCategories)
            {
                for(let i = 0; i < totalCategories; i++)
                {
                    const category = this._categories[i];

                    const searchResult = new NavigatorSearchResult(this, `category:${ category.id }:${ category.name }`, NavigatorSearchAction.NONE, category.listOptions);

                    await searchResult.loadResults();

                    if(searchResult.rooms.length) this._searchResults.push(searchResult);
                }
            }

            this._isUpdating    = false;
            this._lastUpdated   = TimeHelper.now;
        }
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get categories(): NavigatorCategory[]
    {
        return this._categories;
    }

    public get categoryIds(): number[]
    {
        return this._categoryIds;
    }

    public get includes(): string[]
    {
        return this._includes;
    }

    public get searchResults(): NavigatorSearchResult[]
    {
        return this._searchResults;
    }
}