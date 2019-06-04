import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityLogoutComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.SECURITY_LOGOUT);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeBoolean(true).prepare();
    }
}