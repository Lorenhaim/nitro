import { getManager } from 'typeorm';

import { Logger, NavigatorCategoryEntity, NavigatorEventCategoryEntity, NavigatorTabEntity } from '../../common';

import { NavigatorCategory } from './NavigatorCategory';
import { NavigatorEventCategory } from './NavigatorEventCategory';
import { NavigatorTab } from './NavigatorTab';

export class NavigatorManager
{
    private _categories: NavigatorCategory[];
    private _eventCategories: NavigatorEventCategory[];
    private _tabs: NavigatorTab[];

    private _isLoaded: boolean;
    private _isDisposed: boolean;

    constructor()
    {
        this._categories        = [];
        this._eventCategories   = [];
        this._tabs              = [];

        this._isLoaded      = false;
        this._isDisposed    = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded)
        {
            await this.loadCategories();
            await this.loadEventCategories();
            await this.loadTabs();
        
            Logger.writeLine(`NavigatorManager -> Loaded ${ this._categories.length }:categories, ${ this._eventCategories.length }:eventCategories, ${ this._tabs.length }:tabs`);

            this._isLoaded = true;
        }
    }

    private async dispose(): Promise<void>
    {
        if(!this._isDisposed)
        {
            this._categories        = [];
            this._eventCategories   = [];

            this._isLoaded      = false;
            this._isDisposed    = true;
        }
    }

    private async loadCategories(): Promise<void>
    {
        this._categories = [];

        const results = await getManager().find(NavigatorCategoryEntity);

        if(results)
        {
            const totalResults = results.length;
            
            for(let i = 0; i < totalResults; i++)
            {
                const result = results[i];

                this._categories.push({
                    id: result.id,
                    name: result.name
                });
            }
        }
    }

    private async loadEventCategories(): Promise<void>
    {
        this._eventCategories = [];

        const results = await getManager().find(NavigatorEventCategoryEntity);

        if(results)
        {
            const totalResults = results.length;
            
            for(let i = 0; i < totalResults; i++)
            {
                const result = results[i];

                this._categories.push({
                    id: result.id,
                    name: result.name
                });
            }
        }
    }

    private async loadTabs(): Promise<void>
    {
        this._tabs = [];

        const results = await getManager().find(NavigatorTabEntity);

        if(results)
        {
            const totalResults = results.length;
            
            for(let i = 0; i < totalResults; i++)
            {
                const result = results[i];

                this._tabs.push({
                    id: result.id,
                    name: result.name
                });
            }
        }
    }

    public get categories(): NavigatorCategory[]
    {
        return this._categories;
    }

    public get eventCategories(): NavigatorEventCategory[]
    {
        return this._eventCategories;
    }

    public get tabs(): NavigatorTab[]
    {
        return this._tabs;
    }
}