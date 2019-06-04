import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomQueueStatusComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.ROOM_QUEUE_STATUS);
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(1)
            .writeString('Bill') // name
            .writeInt(1) // position in que / target
            .writeInt(1)
            .writeString('d')
            .writeInt(1)
            .prepare();
    }
}