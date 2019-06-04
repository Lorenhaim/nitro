import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserItemsRefreshComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_ITEMS_REFRESH);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}