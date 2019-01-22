import { getManager } from 'typeorm';

import { Logger, NavigatorCategoryEntity } from '../../common';

export class NavigatorManager
{
    private _categories: { id: number; name: string; }[];

    constructor()
    {
        this._categories = [];
    }

    public async init(): Promise<boolean>
    {
        await this.loadCategories();
        
        Logger.writeLine(`NavigatorManager -> Loaded ${ this._categories.length } categorites`);
            
        return Promise.resolve(true);
    }

    private addCategory(category: { id: number; name: string; }): boolean
    {
        if(!category) return false;

        const totalCategories = this._categories.length;

        let result = false;

        for(let i = 0; i < totalCategories; i++)
        {
            const foundCategory = this._categories[i];

            if(foundCategory.id === category.id)
            {
                this._categories.splice(i, 1);

                this._categories.push(category);

                result = true;

                break;
            }
        }

        if(!result) this._categories.push(category);

        return true;
    }

    private async loadCategories(): Promise<boolean>
    {
        this._categories = [];

        const results = await getManager().find(NavigatorCategoryEntity);

        if(!results) return Promise.resolve(true);

        const totalResults = results.length;

        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            this.addCategory({
                id: result.id,
                name: result.name
            });
        }

        return Promise.resolve(true);
    }
}