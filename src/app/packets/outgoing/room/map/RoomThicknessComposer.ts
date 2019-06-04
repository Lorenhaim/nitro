import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomThicknessComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_THICKNESS);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeBoolean(this._room.details.hideWalls)
            .writeInt(this._room.details.thicknessWall)
            .writeInt(this._room.details.thicknessFloor)
            .prepare();
    }
}