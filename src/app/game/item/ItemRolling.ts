import { Item } from '../item';
import { Position } from '../pathfinder';

export class ItemRolling
{
    private _item: Item;
    private _roller: Item;

    private _position: Position;
    private _positionNext: Position;

    constructor(item: Item, roller: Item, position: Position, positionNext: Position)
    {
        if(!(item instanceof Item) || !(roller instanceof Item) || !position || !positionNext) throw new Error('invalid_rolling');

        this._item          = item;
        this._roller        = roller;

        this._position      = position;
        this._positionNext  = positionNext;
    }

    public get item(): Item
    {
        return this._item;
    }

    public get roller(): Item
    {
        return this._roller;
    }

    public get position(): Position
    {
        return this._position;
    }

    public get positionNext(): Position
    {
        return this._positionNext;
    }

    public copy(): ItemRolling
    {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}