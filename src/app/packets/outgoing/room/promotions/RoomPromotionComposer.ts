import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomPromotionComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_PROMOTION);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(-1)
            .writeInt(-1)
            .writeString(null)
            .writeInt(0)
            .writeInt(0)
            .writeString(null)
            .writeString(null)
            .writeInt(0)
            .writeInt(0)
            .writeInt(0)
            .prepare();
    }
}