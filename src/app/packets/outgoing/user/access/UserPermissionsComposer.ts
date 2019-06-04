import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UserPermissionsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_PERMISSIONS);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this.client.user.details.clubActive ? 2 : 0).writeInt(this.client.user.details.rankId).writeBoolean(true).prepare(); // ambassador
    }
}