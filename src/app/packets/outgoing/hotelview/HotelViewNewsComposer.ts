import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class HotelViewNewsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.HOTEL_VIEW_NEWS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeInt(0); // total articles

            //foreach
            //this.packet.writeInt(0); // widget id
            //this.packet.writeString(''); // title
            //this.packet.writeString(''); // message
            //this.packet.writeString(''); // button message
            //this.packet.writeInt(0); // widget type
            //this.packet.writeString(''); // link
            //this.packet.writeString(''); // image
        
            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            this.error(err);
        }
    }
}