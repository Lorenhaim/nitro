import { Logger } from '../../../../../common';

import { BadgesCurrentComposer } from '../../../../outgoing';

import { Incoming } from '../../../Incoming';
import { IncomingHeader } from '../../../IncomingHeader';

export class BadgesCurrentEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_BADGES_CURRENT) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                await this.user.client().processComposer(new BadgesCurrentComposer(this.user, this.packet.readInt()));
            }
            
            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}