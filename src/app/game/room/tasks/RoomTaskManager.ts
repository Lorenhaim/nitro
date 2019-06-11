import { Manager } from '../../../common';
import { Nitro } from '../../../Nitro';
import { Room } from '../Room';
import { RollerTask } from './RollerTask';
import { UnitActionTask } from './UnitActionTask';
import { UnitStatusTask } from './UnitStatusTask';

export class RoomTaskManager extends Manager
{
    private _room: Room;

    private _rollerTask: RollerTask;
    private _actionTask: UnitActionTask;
    private _statusTask: UnitStatusTask;

    private _rollerInterval: NodeJS.Timeout;
    private _actionInterval: NodeJS.Timeout;
    private _statusInterval: NodeJS.Timeout;

    constructor(room: Room)
    {
        super('RoomTaskManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room              = room;

        this._rollerTask        = new RollerTask(this._room);
        this._actionTask        = new UnitActionTask(this._room);
        this._statusTask        = new UnitStatusTask(this._room);

        this._rollerInterval    = null;
        this._actionInterval    = null;
        this._statusInterval    = null;
    }

    protected onInit(): void
    {
        this._rollerInterval    = setInterval(() => this._rollerTask.run(), Nitro.config.game.rollerTick);
        this._actionInterval    = setInterval(() => this._actionTask.run(), 500);
        this._statusInterval    = setInterval(() => this._statusTask.run(), 1000);
    }

    protected onDispose(): void
    {
        if(this._rollerInterval) clearInterval(this._rollerInterval);
        if(this._actionInterval) clearInterval(this._actionInterval);
        if(this._statusInterval) clearInterval(this._statusInterval);
    }

    public get room(): Room
    {
        return this._room;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}