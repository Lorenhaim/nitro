import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityPingComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.SECURITY_PING);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}