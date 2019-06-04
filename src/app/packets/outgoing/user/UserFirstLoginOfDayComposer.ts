import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserFirstLoginOfDayComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.FIRST_LOGIN_OF_DAY);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeBoolean(this.client.user.details.firstLoginOfDay).prepare();
    }
}