import { Manager } from '../../../common';
import { Nitro } from '../../../Nitro';
import { Room } from '../Room';
import { RollerTask } from './RollerTask';
import { UnitActionTask } from './UnitActionTask';

export class RoomTaskManager extends Manager
{
    private _room: Room;

    private _rollerTask: RollerTask;
    private _actionTask: UnitActionTask;

    private _rollerInterval: NodeJS.Timeout;
    private _actionInterval: NodeJS.Timeout;

    constructor(room: Room)
    {
        super('RoomTaskManager', room.logger);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room              = room;

        this._rollerTask        = new RollerTask(this._room);
        this._actionTask        = new UnitActionTask(this._room);

        this._rollerInterval    = null;
        this._actionInterval    = null;
    }

    protected onInit(): void
    {
        this._rollerInterval    = setInterval(() => this._rollerTask.run(), Nitro.config.game.tasks.roller.tick);
        this._actionInterval    = setInterval(() => this._actionTask.run(), Nitro.config.game.tasks.unit.tick);
    }

    protected onDispose(): void
    {
        if(this._rollerInterval) clearInterval(this._rollerInterval);
        if(this._actionInterval) clearInterval(this._actionInterval);
    }

    public get room(): Room
    {
        return this._room;
    }
}