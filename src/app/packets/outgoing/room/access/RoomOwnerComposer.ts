import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomOwnerComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.ROOM_OWNER);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}