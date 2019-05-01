import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomModelComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_MODEL);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeBoolean(true)
                .writeInt(this._room.details.wallHeight)
                .writeString(this._room.model.model)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}