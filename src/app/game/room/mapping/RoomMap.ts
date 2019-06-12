import { NumberHelper } from '../../../common';
import { RoomStackHeightComposer } from '../../../packets';
import { BaseItemType } from '../../item';
import { AffectedPositions, Direction, Position } from '../../pathfinder';
import { Unit, UnitType } from '../../unit';
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

        if(!totalX || !totalY) return;

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

        if(!totalTiles) return;

        for(let i = 0; i < totalTiles; i++) this._tiles[i].clearUnits();

        const totalUnits = this._room.unitManager.units.length;

        if(!totalUnits) return;

        for(let i = 0; i < totalUnits; i++)
        {
            const unit = this._room.unitManager.units[i];

            if(!unit) continue;

            const tile = unit.location.getCurrentTile();

            if(!tile) continue;
            
            tile.addUnit(unit);
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

            const affectedPositions = AffectedPositions.getPositions(item);

            if(!affectedPositions) continue;

            const totalAffectedPositions = affectedPositions.length;

            if(!totalAffectedPositions) continue;

            for(let j = 0; j < totalAffectedPositions; j++)
            {
                const position = affectedPositions[j];

                if(!position) continue;

                const tile = this.getTile(position);

                if(!tile) continue;

                tile.addItem(item);

                if(tile.tileHeight > item.height) continue;

                item.itemBelow      = tile.highestItem;
                tile.tileHeight     = item.height;
                tile.highestItem    = item;
            }
        }

        this._room.itemManager.setDimmer();
    }

    public getTile(position: Position): RoomTile
    {
        if(!position || this._map[position.x] === undefined || this._map[position.x][position.y] === undefined) return null;
        
        const tile = this._map[position.x][position.y];

        if(!tile) return null;

        const state = this._room.model.getTileState(tile.position.x, tile.position.y);

        if(!state || state === RoomTileState.CLOSED) return null;
        
        return tile;
    }

    public getBlockedPositions(): Position[]
    {
        const results: Position[] = [];

        const totalTiles = this._tiles.length;

        if(!totalTiles) return null;

        for(let i = 0; i < totalTiles; i++)
        {
            const tile = this._tiles[i];

            if(!tile) continue;

            const highestItem = tile.highestItem;

            if(!highestItem) continue;

            results.push(...AffectedPositions.getPositions(highestItem))
        }

        if(!results.length) return null;

        return results;
    }

    public getValidTile(unit: Unit, position: Position, isGoal: boolean = true): RoomTile
    {
        if(!unit || !position) return null;
        
        const tile = this.getTile(position);

        if(!tile) return null;
        
        if(tile.isDoor) return tile;
        
        const totalUnits = tile.units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const existingUnit = tile.units[i];

                if(!existingUnit) continue;

                if(existingUnit.id === unit.id) return tile;

                if(existingUnit === unit.connectedUnit) return tile; // horse
            }

            if(this._room.details.allowWalkThrough)
            {
                if(isGoal) return null;
            }
            else return null;
        }

        const highestItem = tile.highestItem;

        if(!highestItem) return tile;

        if(highestItem.groupId)
        {
            if(!highestItem.isGroupItemOpen(unit)) return null;
        }

        if(unit.type === UnitType.USER && unit.connectedUnit || unit.type === UnitType.PET)
        {
            if(highestItem.baseItem.canSit || highestItem.baseItem.canLay) return null;
        }

        if(!highestItem.isItemOpen) return null;

        return tile;
    }

    public getValidDiagonalTile(unit: Unit, position: Position): RoomTile
    {
        if(!unit || !position) return null;
        
        const tile = this.getTile(position);

        if(!tile) return null;
        
        if(tile.isDoor) return tile;
        
        const totalUnits = tile.units.length;
        
        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const existingUnit = tile.units[i];

                if(!existingUnit) continue;

                if(existingUnit.id === unit.id) return tile;

                if(existingUnit === unit.connectedUnit) return tile;
            }

            if(!this._room.details.allowWalkThrough) return null;
        }

        const highestItem = tile.highestItem;

        if(!highestItem) return tile;

        if(highestItem.groupId)
        {
            if(!highestItem.isGroupItemOpen(unit)) return null;
        }

        if(highestItem.baseItem.canSit || highestItem.baseItem.canLay) return null;

        if(!highestItem.isItemOpen) return null;

        return tile;
    }

    public getValidRandomTile(unit: Unit): RoomTile
    {
        if(!unit) return null;
        
        for(let i = 0; i < 10; i++)
        {
            const x = NumberHelper.randomNumber(1, this._room.model.totalX);
            const y = NumberHelper.randomNumber(1, this._room.model.totalY);

            const tile = this.getValidTile(unit, new Position(x, y));

            if(tile) return tile;
        }

        return null;
    }

    public getClosestValidPillow(unit: Unit, position: Position): Position
    {
        if(!unit || !position) return null;
        
        const tile = this.getTile(position);

        if(!tile) return null;
        
        const item = tile.highestItem;

        if(!item) return null;
        
        const pillowPositions = AffectedPositions.getPillowPositions(item);

        if(!pillowPositions) return null;
        
        const totalPositions = pillowPositions.length;

        if(!totalPositions) return null;

        let timesChecked = 0;

        for(let i = 0; i < totalPositions; i++)
        {
            const pillowPosition = pillowPositions[i];

            if(!pillowPosition) continue;
            
            if(item.position.direction === Direction.NORTH)
            {
                if(position.x === pillowPosition.x)
                {
                    if(this.getValidTile(unit, pillowPosition)) return pillowPosition;
                }
            }

            else if(item.position.direction === Direction.EAST)
            {
                if(position.y === pillowPosition.y)
                {
                    if(this.getValidTile(unit, pillowPosition)) return pillowPosition;
                }
            }

            if(timesChecked === 1) return pillowPosition;

            timesChecked++;
        }

        return null;
    }

    public updatePositions(updateUnits: boolean, ...positions: Position[]): void
    {
        const updatedPositions = [ ...positions ];

        if(!updatedPositions) return;

        const totalPositions = updatedPositions.length;

        if(!totalPositions) return;

        this._room.map.generateCollisions();
        
        if(updateUnits) this._room.unitManager.updateUnitsAt(...updatedPositions);

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