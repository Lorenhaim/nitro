import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityUnknown2Composer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.SECURITY_UNKNOWN2);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeString(null, null).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}