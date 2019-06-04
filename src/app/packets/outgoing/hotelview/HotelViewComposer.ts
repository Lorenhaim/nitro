import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class HotelViewComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.HOTEL_VIEW);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}