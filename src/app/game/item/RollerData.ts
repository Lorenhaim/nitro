import { Item } from '../item';
import { Position } from '../pathfinder';
import { Room, RoomTile } from '../room';
import { Unit } from '../unit';

export class RollerData
{
    private _roller: Item;

    private _position: Position;
    private _positionNext: Position;

    private _units: Unit[]
    private _items: Item[];

    constructor(roller: Item)
    {
        if(!(roller instanceof Item) || !(roller.room instanceof Room)) throw new Error('invalid_roller');

        this._roller = roller;

        this._units = [];
        this._items = [];

        this._position      = roller.position.copy();
        this._positionNext  = roller.position.getPositionInfront();
    }

    public getTile(): RoomTile
    {
        return this._roller.room.map.getTile(this._position);
    }

    public getGoalTile(): RoomTile
    {
        return this._roller.room.map.getTile(this._positionNext);
    }

    public finishRoll(): void
    {
        const room = this._roller.room;

        if(!room) return;

        const totalUnits = this._units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const unit = this._units[i];

                if(!unit) continue;

                unit.location.rolling = null;
            }

            room.unitManager.updateUnits(...this._units);
        }

        const totalItems = this._items.length;

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const item = this._items[i];

                if(!item) continue;

                item.rolling = null;
            }
        }
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

    public get units(): Unit[]
    {
        return this._units;
    }

    public get items(): Item[]
    {
        return this._items;
    }
}