import { Logger } from '../../../common';

import { HotelViewNewsComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class HotelViewNewsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.HOTELVIEW_NEWS) throw new Error('invalid_header');
            
            if(this.user.isAuthenticated) await this.user.client().processComposer(new HotelViewNewsComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}