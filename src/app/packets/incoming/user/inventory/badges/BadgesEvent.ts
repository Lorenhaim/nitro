import { Logger } from '../../../../../common';

import { BadgesComposer } from '../../../../outgoing';

import { Incoming } from '../../../Incoming';
import { IncomingHeader } from '../../../IncomingHeader';

export class BadgesEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_BADGES) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.inventory() && this.user.inventory().badges())
            {
                if(!this.user.inventory().badges().isLoaded) await this.user.inventory().badges().init();

                await this.user.client().processComposer(new BadgesComposer(this.user));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}