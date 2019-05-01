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
        try
        {
            this.packet.writeBoolean(true);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            this.error(err);
        }
    }
}