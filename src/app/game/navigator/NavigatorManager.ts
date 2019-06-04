import { getManager } from 'typeorm';
import { Manager } from '../../common';
import { NavigatorCategoryEntity, NavigatorEventCategoryEntity, NavigatorTabEntity } from '../../database';
import { NavigatorCategory } from './NavigatorCategory';
import { NavigatorEventCategory } from './NavigatorEventCategory';
import { NavigatorTab } from './NavigatorTab';

export class NavigatorManager extends Manager
{
    private _categories: NavigatorCategory[];
    private _eventCategories: NavigatorEventCategory[];
    private _tabs: NavigatorTab[];

    constructor()
    {
        super('NavigatorManager');

        this._categories        = [];
        this._eventCategories   = [];
        this._tabs              = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadCategories();
        await this.loadEventCategories();
        await this.loadTabs();
    }

    protected async onDispose(): Promise<void>
    {
        this._categories        = [];
        this._eventCategories   = [];
        this._tabs              = [];
    }

    private async loadCategories(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._categories = [];

        const results = await getManager().find(NavigatorCategoryEntity);

        if(results)
        {
            const totalResults = results.length;

            if(totalResults) for(let i = 0; i < totalResults; i++) this._categories.push(new NavigatorCategory(results[i]));
        }

        this.logger.log(`Loaded ${ this._categories.length } categories`);
    }

    private async loadEventCategories(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._eventCategories = [];

        const results = await getManager().find(NavigatorEventCategoryEntity);

        if(results)
        {
            const totalResults = results.length;
        
            if(totalResults) for(let i = 0; i < totalResults; i++) this._eventCategories.push(new NavigatorEventCategory(results[i]));
        }

        this.logger.log(`Loaded ${ this._eventCategories.length } event categories`);
    }

    private async loadTabs(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._tabs = [];

        const results = await getManager().find(NavigatorTabEntity);

        if(results)
        {
            const totalResults = results.length;
        
            if(totalResults) for(let i = 0; i < totalResults; i++) this._tabs.push(new NavigatorTab(results[i]));
        }

        this.logger.log(`Loaded ${ this._tabs.length } tabs`);
    }

    public getCategory(id: number): NavigatorCategory
    {
        const totalCategories = this._categories.length;

        if(totalCategories)
        {
            for(let i = 0; i < totalCategories; i++)
            {
                const category = this._categories[i];

                if(category.id === id) return category;
            }
        }

        return null;
    }

    public getEventCategory(id: number): NavigatorEventCategory
    {
        const totalEventCategories = this._eventCategories.length;

        if(totalEventCategories)
        {
            for(let i = 0; i < totalEventCategories; i++)
            {
                const eventCategory = this._eventCategories[i];

                if(eventCategory.id === id) return eventCategory;
            }
        }

        return null;
    }

    public getTab(id: number, name?: string): NavigatorTab
    {
        const totalTabs = this._tabs.length;

        if(totalTabs)
        {
            for(let i = 0; i < totalTabs; i++)
            {
                const tab = this._tabs[i];
                    
                if(id && tab.id === id) return tab;
                else if(name && tab.name === name) return tab;
            }
        }

        return null;
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