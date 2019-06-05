import { RoomModelEntity } from '../../../database';
import { BaseItemType } from '../../item';
import { Direction, Position } from '../../pathfinder';
import { RoomTileState } from '../mapping';
import { Room } from '../Room';

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

    private _didGenerate: boolean;

    constructor(entity: RoomModelEntity)
    {
        if(!(entity instanceof RoomModelEntity)) throw new Error('invalid_entity');

        this._entity        = entity;
        this._model         = this.cleanModel(this._entity.model);
        this._doorPosition  = null;

        if(!this._model) throw new Error('invalid_model');

        this.resetModel();
    }

    private cleanModel(model: string): string
    {
        if(!model) return null;

        return model.trim().replace(/\r\n|\r|\n/g, '\r');
    }

    public resetModel(generate: boolean = true): void
    {
        this._doorPosition  = null;

        this._totalX        = 0;
        this._totalY        = 0;
        this._totalSize     = 0;

        this._tileStates    = [];
        this._tileHeights   = [];

        this._didGenerate   = false;

        if(generate) this.generateModel();
    }

    private generateModel(): void
    {
        const parts     = this._model.split('\r');
        const totalX    = parts[0].length;
        const totalY    = parts.length;

        if(!parts || !totalX || !totalY) return this.resetModel(false);

        for(let y = 0; y < totalY; y++)
        {
            const currentY = parts[y];

            if(!currentY || currentY === '\r') continue;

            const currentYLength = currentY.length;

            if(!currentYLength) continue;

            for(let x = 0; x < totalX; x++)
            {
                if(currentYLength !== totalX) return this.resetModel(false);

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

        if(this._totalSize !== (totalX * totalY)) return this.resetModel(false);

        this._totalX    = totalX;
        this._totalY    = totalY;

        const doorTileState     = this.getTileState(this._entity.doorX, this._entity.doorY);
        const doorTileHeight    = this.getTileHeight(this._entity.doorX, this._entity.doorY);

        if(doorTileState === RoomTileState.CLOSED) return this.resetModel(false);

        this._doorPosition  = new Position(this._entity.doorX, this._entity.doorY, doorTileHeight, parseInt(<any> this._entity.doorDirection), parseInt(<any> this._entity.doorDirection));

        this._didGenerate = true;
    }

    public validateModel(room: Room): boolean
    {
        if(!room) return false;

        const items = room.itemManager.getItemsByType(BaseItemType.FLOOR);

        if(!items) return true;

        const totalItems = items.length;

        if(!totalItems) return true;

        for(let i = 0; i < totalItems; i++)
        {
            const item = items[i];

            if(!item) continue;

            const tileState = this.getTileState(item.position.x, item.position.y);

            if(!tileState || tileState === RoomTileState.CLOSED) return false;
        }

        return true;
    }

    public getTileState(x: number, y: number): RoomTileState
    {
        if(this._tileStates[x] !== undefined && this._tileStates[x][y] !== undefined) return this._tileStates[x][y];

        return null;
    }

    public getTileHeight(x: number, y: number): number
    {
        if(this._tileHeights[x] !== undefined && this._tileHeights[x][y] !== undefined) return this._tileHeights[x][y];

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

    public get isCustom(): boolean
    {
        return this._entity.custom === '1';
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

    public get didGenerate(): boolean
    {
        return this._didGenerate;
    }
}