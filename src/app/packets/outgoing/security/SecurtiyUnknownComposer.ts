import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityUnknownComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.SECURITY_UNKNOWN);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}