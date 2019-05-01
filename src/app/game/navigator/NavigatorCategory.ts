import { NavigatorCategoryEntity } from '../../database';
import { NavigatorListCollapsed, NavigatorListMode, NavigatorListOptions } from './list';

export class NavigatorCategory
{
    private _entity: NavigatorCategoryEntity;

    constructor(entity: NavigatorCategoryEntity)
    {
        if(!(entity instanceof NavigatorCategoryEntity)) throw new Error('invalid_entity');

        this._entity = entity;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get isPublic(): boolean
    {
        return this._entity.isPublic === '1';
    }

    public get showHidden(): boolean
    {
        return this._entity.showHidden === '1';
    }

    public get listMode(): NavigatorListMode
    {
        return this._entity.listMode;
    }

    public get listCollapsed(): NavigatorListCollapsed
    {
        return this._entity.listCollapsed;
    }

    public get listOptions(): NavigatorListOptions
    {
        return {
            collapsed: this.listCollapsed,
            mode: this.listMode,
            showHidden: this.showHidden
        };
    }

    public get timestampCreated(): Date
    {
        return this._entity.timestampCreated;
    }
}