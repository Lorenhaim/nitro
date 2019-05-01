import { RoomModelEntity } from '../../../database';
import { Direction, Position } from '../../pathfinder';
import { RoomTileState } from '../mapping';

export class RoomModel
{
    private _entity: RoomModelEntity;
    private _model: string;
    private _doorPosition: Position;

    private _totalX: number;
    private _totalY: number;
    private _totalSize: number;

    private _tileStates: RoomTileState[][];
    private _tileHeights: number[][];

    constructor(entity: RoomModelEntity)
    {
        if(!(entity instanceof RoomModelEntity)) throw new Error('invalid_entity');

        this._entity        = entity;
        this._model         = this._entity.model.replace(/\r\n|\r|\n/g, '\r') || null;
        this._doorPosition  = null;

        this._totalX        = 0;
        this._totalY        = 0;
        this._totalSize     = 0;

        this._tileStates    = [];
        this._tileHeights   = [];

        this.buildMap();
    }

    private buildMap(): void
    {
        const parts     = this._entity.model.split(/\r?\n/);
        const totalX    = parts[0].length;
        const totalY    = parts.length;

        for(let y = 0; y < totalY; y++)
        {
            if(parts[y].length === 0 || parts[y] === '\r') break;

            for(let x = 0; x < totalX; x++)
            {
                if(parts[y].length !== totalX) break;

                const square = parts[y].substring(x, x + 1).trim().toLowerCase();

                if(this._tileStates[x] === undefined)   this._tileStates[x] = [];
                if(this._tileHeights[x] === undefined)  this._tileHeights[x] = [];

                if(square === 'x')
                {
                    this._tileStates[x][y] = RoomTileState.CLOSED;
                    this._tileHeights[x][y] = 0;
                }

                else if(square === '0')
                {
                    this._tileStates[x][y]  = RoomTileState.OPEN;
                    this._tileHeights[x][y] = 0;
                }

                else
                {
                    const index = 'abcdefghijklmnopqrstuvwxyz'.indexOf(square);

                    if(index === -1)
                    {
                        this._tileStates[x][y]  = RoomTileState.OPEN;
                        this._tileHeights[x][y] = parseInt(square);
                    }
                    else
                    {
                        this._tileStates[x][y]  = RoomTileState.OPEN;
                        this._tileHeights[x][y] = index + 10;
                    }
                }

                this._totalSize++;
            }
        }

        this._totalX    = totalX;
        this._totalY    = totalY;

        const doorTileHeight = this.getTileHeight(this._entity.doorX, this._entity.doorY);

        if(doorTileHeight !== null)
        {
            this._doorPosition = new Position(this._entity.doorX, this._entity.doorY, doorTileHeight, parseInt(<any> this._entity.doorDirection), parseInt(<any> this._entity.doorDirection));

            this._tileStates[this._entity.doorX][this._entity.doorY] = RoomTileState.OPEN;
        }
    }

    public getTileState(x: number, y: number): RoomTileState
    {
        if(this._tileStates[x] !== undefined && this._tileStates[x][y] !== undefined)
        {
            return this._tileStates[x][y];
        }

        return null;
    }

    public getTileHeight(x: number, y: number): number
    {
        if(this._tileHeights[x] !== undefined && this._tileHeights[x][y] !== undefined)
        {
            return this._tileHeights[x][y];
        }

        return null;
    }

    public get id(): number
    {
        return this._entity.id;
    }

    public get name(): string
    {
        return this._entity.name;
    }

    public get doorX(): number
    {
        return this._entity.doorX;
    }

    public get doorY(): number
    {
        return this._entity.doorY;
    }

    public get doorDirection(): Direction
    {
        return this._entity.doorDirection;
    }

    public get model(): string
    {
        return this._model;
    }

    public get rawModel(): string
    {
        return this._entity.model;
    }

    public get totalX(): number
    {
        return this._totalX;
    }

    public get totalY(): number
    {
        return this._totalY;
    }

    public get totalSize(): number
    {
        return this._totalSize;
    }

    public get doorPosition(): Position
    {
        return this._doorPosition;
    }
}