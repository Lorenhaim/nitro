import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UserRightsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_RIGHTS);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeBoolean(true, true, true).prepare();
    }
}