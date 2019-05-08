import { Interaction } from '../../item';
import { Item } from '../../item/Item';
import { Position } from '../../pathfinder';
import { Unit } from '../../unit';
import { Room } from '../Room';
import { RoomTileState } from './RoomTileState';

export class RoomTile
{
    private _room: Room;

    private _position: Position;
    private _tileHeight: number;
    private _defaultHeight: number;

    private _units: Unit[];
    private _items: Item[];
    private _highestItem: Item;

    private _state: RoomTileState;
    private _isDoor: boolean;

    constructor(room: Room, position: Position, tileHeight?: number)
    {
        if(!(room instanceof Room) || !(position instanceof Position)) throw new Error('invalid_tile');

        this._room          = room;

        this._position      = position;
        this._tileHeight    = tileHeight || 0;
        this._defaultHeight = tileHeight || 0;

        this._units         = [];
        this._items         = [];
        this._highestItem   = null;

        this._state         = RoomTileState.OPEN;
        this._isDoor        = false;
    }

    public addUnit(unit: Unit): void
    {
        if(unit && !this._isDoor)
        {
            const totalUnits = this._units.length;

            if(totalUnits)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const existingUnit = this._units[i];

                    if(existingUnit.id === unit.id) return;
                }
            }

            this._units.push(unit);
        }
    }

    public removeUnit(unit: Unit): void
    {
        if(unit)
        {
            const totalUnits = this._units.length;

            if(totalUnits)
            {
                for(let i = 0; i < totalUnits; i++)
                {
                    const result = this._units[i];

                    if(result.id === unit.id)
                    {
                        this._units.splice(i, 1);

                        return;
                    }
                }
            }
        }
    }

    public getItem(item: Item): Item
    {
        if(item)
        {
            const totalItems = this._items.length;

            if(totalItems)
            {
                for(let i = 0; i < totalItems; i++)
                {
                    const activeItem = this._items[i];

                    if(activeItem.id === item.id) return activeItem;
                }
            }
        }

        return null;
    }

    public hasInteraction(...interactions: typeof Interaction[]): boolean
    {
        const types = [ ...interactions ];

        if(!types) return false;
        
        const totalTypes = types.length;

        if(!totalTypes) return false;

        const totalItems = this._items.length;

        if(!totalItems) return false;
        
        for(let i = 0; i < totalTypes; i++)
        {
            const type = types[i];

            if(!type) continue;

            for(let j = 0; j < totalItems; j++)
            {
                const item = this._items[j];

                if(!item) continue;

                if(item.baseItem.interaction instanceof type) return true;
            }
        }

        return false;
    }

    public addItem(item: Item): void
    {
        if(item)
        {
            const totalItems = this._items.length;

            if(totalItems)
            {
                for(let i = 0; i < totalItems; i++)
                {
                    const activeItem = this._items[i];

                    if(activeItem.id === item.id) return;
                }
            }

            this._items.push(item);
        }
    }

    public clearItems(): void
    {
        this._items         = [];
        this._highestItem   = null;
    }

    public clearUnits(): void
    {
        this._units = [];
    }

    public touches(roomTile: RoomTile): boolean
    {
        return roomTile && this._position.getDistanceAround(roomTile.position) <= 2;
    }

    public getRelativeHeight(): number
    {
        if(this._state === RoomTileState.CLOSED || !this.canStack || this.isDoor) return 32767;

        return this._tileHeight * 256;
    }

    public copyTile(): RoomTile
    {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    public get room(): Room
    {
        return this._room;
    }

    public get position(): Position
    {
        return this._position;
    }

    public get tileHeight(): number
    {
        return this._tileHeight;
    }

    public set tileHeight(height: number)
    {
        this._tileHeight = height;
    }

    public get defaultHeight(): number
    {
        return this._defaultHeight;
    }

    public get units(): Unit[]
    {
        return this._units;
    }

    public get items(): Item[]
    {
        return this._items;
    }

    public get highestItem(): Item
    {
        return this._highestItem;
    }

    public set highestItem(item: Item)
    {
        this._highestItem = item;
    }

    public get state(): RoomTileState
    {
        return this._state;
    }

    public set state(state: RoomTileState)
    {
        this._state = state;
    }

    public get isDoor(): boolean
    {
        return this._isDoor;
    }

    public set isDoor(value: boolean)
    {
        this._isDoor = value;
    }

    public get canWalk(): boolean
    {
        if(this._highestItem) return this._highestItem.baseItem.canWalk;
        
        return true;
    }

    public get canStack(): boolean
    {
        if(this._highestItem) return this._highestItem.baseItem.canStack;

        return true;
    }

    public get walkingHeight(): number
    {
        let height = this._tileHeight;

        if(this._highestItem)
        {
            height = this._highestItem.height;
            
            if(this._highestItem.baseItem.canSit || this._highestItem.baseItem.canLay) height -= this._highestItem.baseItem.stackHeight;
        }

        return height;
    }
}