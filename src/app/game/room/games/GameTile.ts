import { Item } from '../../item';
import { Position } from '../../pathfinder';

export class GameTile
{
    private _item: Item;

    constructor(item: Item)
    {
        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public get position(): Position
    {
        return this._item.position;
    }

    public get item(): Item
    {
        return this._item;
    }
}