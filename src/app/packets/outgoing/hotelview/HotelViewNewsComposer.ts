import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class HotelViewNewsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.HOTELVIEW_NEWS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
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
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}