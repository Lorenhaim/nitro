import { Logger } from '../../../common';

import { HotelViewCampaignComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class HotelViewCampaignsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.HOTELVIEW_CAMPAIGNS) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                const something = this.packet.readString();

                console.log(something);

                await this.user.client().processComposer(new HotelViewCampaignComposer(this.user));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}