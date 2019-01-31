import { Logger } from '../../../../common';
import { User } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class CurrencyComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_CURRENCY, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated)
            {
                this.packet.writeInt(1); // total point types to send
            
                //foreach
                this.packet.writeInt(1); // point type
                this.packet.writeInt(5); // point amount

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