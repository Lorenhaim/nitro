import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserBuildersClubComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.BUILDERS_CLUB_EXPIRED);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(2147483647, 0, 100, 2147483647, 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}