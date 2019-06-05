import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ClientPingComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.CLIENT_PING);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}