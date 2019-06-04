import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomEnterComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.ROOM_ENTER);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}