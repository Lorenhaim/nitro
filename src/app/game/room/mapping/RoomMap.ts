import { NumberHelper } from '../../../common';
import { RoomStackHeightComposer } from '../../../packets';
import { BaseItemType } from '../../item';
import { AffectedPositions, Position } from '../../pathfinder';
import { Unit } from '../../unit';
import { Room } from '../Room';
import { RoomTile } from './RoomTile';
import { RoomTileState } from './RoomTileState';

export class RoomMap
{
    private _room: Room;

    private _map: RoomTile[][];
    private _tiles: RoomTile[];

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room  = room;

        this._map   = [];
        this._tiles = [];
    }

    public dispose(): void
    {
        this._map   = [];
        this._tiles = [];
    }

    public generateMap(): void
    {
        this._map   = [];
        this._tiles = [];

        const totalX    = this._room.model.totalX;
        const totalY    = this._room.model.totalY;

        if(totalX && totalY)
        {
            for(let y = 0; y < totalY; y++)
            {
                for(let x = 0; x < totalX; x++)
                {
                    const tile = new RoomTile(this._room, new Position(x, y), this._room.model.getTileHeight(x, y));

                    if(tile.position.compare(this._room.model.doorPosition)) tile.isDoor = true;

                    tile.state = this._room.model.getTileState(x, y) || RoomTileState.CLOSED;

                    if(this._map[x] === undefined) this._map[x] = [];

                    this._map[x][y] = tile;

                    this._tiles.push(this._map[x][y]);
                }
            }
        }

        this.generateCollisions();
    }

    public generateCollisions(): void
    {
        this.generateUnitCollison();
        this.generateItemCollision();
    }

    public generateUnitCollison(): void
    {
        const totalTiles = this._tiles.length;

        if(totalTiles)
        {
            for(let i = 0; i < totalTiles; i++)
            {
                const tile = this._tiles[i];

                tile.clearUnits();
            }
        }

        const units = this._room.unitManager.units;

        if(units)
        {
            const totalUnits = units.length;

            for(let i = 0; i < totalUnits; i++)
            {
                const unit = units[i];

                const tile = unit.location.getCurrentTile();

                if(tile) tile.addUnit(unit);
            }
        }
    }

    public generateItemCollision(): void
    {
        const totalTiles = this._tiles.length;

        if(!totalTiles) return;
        
        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this._tiles[i];

            if(!tile) continue;

            tile.clearItems();
            tile.tileHeight = tile.defaultHeight;
        }

        const items = this._room.itemManager.items;

        if(!items) return;
        
        const totalItems = items.length;

        if(!totalItems) return;
        
        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            if(item.baseItem.type !== BaseItemType.FLOOR) continue;
            
            const tile = item.getTile();

            if(!tile) continue;
            
            tile.addItem(item);

            if(tile.tileHeight < item.height)
            {
                item.itemBelow      = tile.highestItem;
                tile.tileHeight     = item.height;
                tile.highestItem    = item;

                const affectedPositions = AffectedPositions.getPositions(item);

                if(!affectedPositions) continue;

                const totalPositions = affectedPositions.length;

                if(!totalPositions) continue;

                for(let j = 0; j < totalPositions; j++)
                {
                    const position = affectedPositions[j];

                    if(!position) continue;

                    if(position.compare(item.position)) continue;

                    const affectedTile = this.getTile(position);

                    if(!affectedTile) continue;

                    if(affectedTile.highestItem)
                    {
                        if(affectedTile.highestItem.position.z > item.position.z) continue;
                    }

                    affectedTile.tileHeight     = item.height;
                    affectedTile.highestItem    = item;
                }
            }
        }
    }

    public getTile(position: Position): RoomTile
    {
        if(position && this._map[position.x] !== undefined && this._map[position.x][position.y] !== undefined) return this._map[position.x][position.y];

        return null;
    }

    public getValidTile(unit: Unit, position: Position): RoomTile
    {
        if(position)
        {
            const tile = this.getTile(position);

            if(tile)
            {
                if(tile.isDoor) return tile;

                if(this._room.model.getTileState(tile.position.x, tile.position.y) === RoomTileState.OPEN)
                {
                    const totalUnits = tile.units.length;

                    if(totalUnits)
                    {
                        for(let i = 0; i < totalUnits; i++)
                        {
                            const existingUnit = tile.units[i];

                            if(existingUnit)
                            {
                                if(unit)
                                {
                                    if(existingUnit.id === unit.id) return tile;

                                    if(existingUnit === unit.connectedUnit) return tile;
                                }
                            }
                        }

                        return null;
                    }

                    const highestItem = tile.highestItem;

                    if(!tile.canWalk)
                    {
                        if(highestItem)
                        {
                            if(unit)
                            {
                                if(highestItem.isItemOpen) return tile;

                                if(!highestItem.position.compare(unit.location.position)) return null;
                            }

                            if(highestItem.isItemOpen) return tile;
                            
                            return null;
                        }
                    }
                    else
                    {
                        if(highestItem)
                        {
                            if(!highestItem.isItemOpen) return null;
                            
                            const height = highestItem.height;

                            const totalItems = tile.items.length;

                            if(totalItems > 1)
                            {
                                for(let i = 0; i < totalItems; i++)
                                {
                                    const item = tile.items[i];

                                    if(item.height === height)
                                    {
                                        if(!item.baseItem.canWalk) return null;
                                    }
                                }
                            }
                        }
                    }
                    
                    return tile;
                }
            }
        }

        return null;
    }

    public getValidDiagonalTile(unit: Unit, position: Position): RoomTile
    {
        if(unit && position)
        {
            const tile = this.getTile(position);

            if(tile)
            {
                if(tile.isDoor) return tile;

                if(this._room.model.getTileState(tile.position.x, tile.position.y) === RoomTileState.OPEN)
                {
                    const totalUnits = tile.units.length;

                    if(totalUnits)
                    {
                        for(let i = 0; i < totalUnits; i++)
                        {
                            const existingUnit = tile.units[i];

                            if(existingUnit)
                            {
                                if(unit)
                                {
                                    if(existingUnit.id === unit.id) return tile;

                                    if(existingUnit === unit.connectedUnit) return tile;
                                }
                            }
                        }

                        return null;
                    }

                    const item = tile.highestItem;

                    if(item)
                    {
                        if(item.baseItem.canSit || item.baseItem.canLay) return null;

                        if(!item.isItemOpen) return null;
                    }

                    return tile;
                }
            }
        }

        return null;
    }

    public getValidRandomTile(unit: Unit): RoomTile
    {
        if(unit)
        {
            for(let i = 0; i < 10; i++)
            {
                const x = NumberHelper.randomNumber(1, this._room.model.totalX);
                const y = NumberHelper.randomNumber(1, this._room.model.totalY);

                const tile = this.getValidTile(unit, new Position(x, y));

                if(tile) return tile;
            }
        }

        return null;
    }

    public getClosestValidPillow(unit: Unit, position: Position): Position
    {
        if(unit && position)
        {
            const tile = this.getTile(position);

            if(tile)
            {
                const item = tile.highestItem;

                if(item)
                {
                    const pillowPositions = AffectedPositions.getPillowPositions(item);

                    if(pillowPositions)
                    {
                        const totalPositions = pillowPositions.length;

                        if(totalPositions)
                        {
                            for(let i = 0; i < totalPositions; i++)
                            {
                                const pillowPosition = pillowPositions[i];

                                if(pillowPosition.compare(position) && this.getValidTile(unit, pillowPosition)) return pillowPosition;
                            }

                            for(let i = 0; i < totalPositions; i++)
                            {
                                const pillowPosition = pillowPositions[i];

                                if(pillowPosition.x === position.x || pillowPosition.y === position.y && this.getValidTile(unit, pillowPosition)) return pillowPosition;
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    public updatePositions(...positions: Position[]): void
    {
        const updatedPositions = [ ...positions ];

        if(!updatedPositions) return;

        const totalPositions = updatedPositions.length;

        if(!totalPositions) return;

        this._room.map.generateCollisions();
        this._room.unitManager.updateUnitsAt(...updatedPositions);

        const affectedTiles: RoomTile[] = [];

        for(let i = 0; i < totalPositions; i++)
        {
            const affectedTile = this.getTile(updatedPositions[i]);

            if(!affectedTile) continue;
            
            affectedTiles.push(affectedTile);
        }

        if(affectedTiles.length) this._room.unitManager.processOutgoing(new RoomStackHeightComposer(...affectedTiles));
    }

    public get room(): Room
    {
        return this._room;
    }

    public get tiles(): RoomTile[]
    {
        return this._tiles;
    }
}