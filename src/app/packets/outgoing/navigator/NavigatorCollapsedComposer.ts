import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorCollapsedComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_COLLAPSED);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(0).prepare();
    }
}