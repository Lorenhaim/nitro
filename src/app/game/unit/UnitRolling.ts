import { Item } from '../item';
import { Position } from '../pathfinder';
import { Unit } from './Unit';

export class UnitRolling
{
    private _unit: Unit;
    private _roller: Item;

    private _position: Position;
    private _positionNext: Position;

    constructor(unit: Unit, roller: Item, position: Position, positionNext: Position)
    {
        if(!(unit instanceof Unit) || !(roller instanceof Item) || !position || !positionNext) throw new Error('invalid_rolling');

        this._unit          = unit;
        this._roller        = roller;

        this._position      = position;
        this._positionNext  = positionNext;
    }

    public get unit(): Unit
    {
        return this._unit;
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

    public copy(): UnitRolling
    {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
}