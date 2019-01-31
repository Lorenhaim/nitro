import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class GetCampaignsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.HOTELVIEW_CAMPAIGNS) throw new Error('invalid_header');

            if(!this.user.isAuthenticated) throw new Error('invalid_authentication');

            const something: string = this.packet.readString();

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}