import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomModelDoorComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_MODEL_DOOR);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._room.model.doorX, this._room.model.doorY, this._room.model.doorDirection).prepare();
    }
}