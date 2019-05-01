import { Room } from '../Room';

export abstract class RoomEvent
{
    private _room: Room;

    public setRoom(room: Room): void
    {
        this._room = room;
    }

    public abstract async runEvent(): Promise<void>;

    public get room(): Room
    {
        return this._room;
    }
}