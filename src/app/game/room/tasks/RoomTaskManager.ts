import { Emulator } from '../../../Emulator';
import { Room } from '../Room';
import { RollerTask } from './RollerTask';
import { UnitActionTask } from './UnitActionTask';
import { UnitStatusTask } from './UnitStatusTask';

export class RoomTaskManager
{
    private _room: Room;

    private _rollerTask: RollerTask;
    private _actionTask: UnitActionTask;
    private _statusTask: UnitStatusTask;

    private _rollerInterval: NodeJS.Timeout;
    private _actionInterval: NodeJS.Timeout;
    private _statusInterval: NodeJS.Timeout;

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(room: Room)
    {
        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room              = room;

        this._rollerTask        = null;
        this._actionTask        = null;
        this._statusTask        = null;

        this._rollerInterval    = null;
        this._actionInterval    = null;
        this._statusInterval    = null;

        this._isLoaded          = false;
        this._isLoading         = false;

        this._isDisposed        = false;
        this._isDisposing       = false;
    }

    public init(): void
    {
        if(!this._isLoaded && !this._isLoading && !this._isDisposing)
        {
            this._isLoading = true;

            this._rollerTask        = new RollerTask(this._room);
            this._actionTask        = new UnitActionTask(this._room);
            this._statusTask        = new UnitStatusTask(this._room);

            this._rollerInterval    = setInterval(async () => await this._rollerTask.run(), Emulator.config.game.rollerTick);
            this._actionInterval    = setInterval(async () => await this._actionTask.run(), 500);
            this._statusInterval    = setInterval(async () => await this._statusTask.run(), 1000);

            this._isLoaded          = true;
            this._isLoading         = false;
            this._isDisposed        = false;
        }
    }

    public dispose(): void
    {
        if(!this._isDisposed && !this._isDisposing && !this._isLoading)
        {
            this._isDisposing = true;

            if(this._rollerInterval) clearInterval(this._rollerInterval);
            if(this._actionInterval) clearInterval(this._actionInterval);
            if(this._statusInterval) clearInterval(this._statusInterval);

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
        }
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