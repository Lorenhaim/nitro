import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserIgnoredComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_IGNORED);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}