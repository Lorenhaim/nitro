import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorLiftedRoomsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_LIFTED);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(0).prepare();
    }
}