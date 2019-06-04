import { Item } from '../item';
import { RollerData } from './RollerData';

export class ItemRolling
{
    private _item: Item;
    private _rollerData: RollerData;

    private _height: number;
    private _nextHeight: number;

    constructor(item: Item, rollerData: RollerData, height: number, heightNext: number)
    {
        if(!(item instanceof Item) || !(rollerData instanceof RollerData)) throw new Error('invalid_roll');

        this._item          = item;
        this._rollerData    = rollerData;

        this._height        = height;
        this._nextHeight    = heightNext;
    }

    public get item(): Item
    {
        return this._item;
    }

    public get rollerData(): RollerData
    {
        return this._rollerData;
    }

    public get height(): number
    {
        return this._height;
    }

    public get nextHeight(): number
    {
        return this._nextHeight;
    }
}