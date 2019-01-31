import { Logger } from '../../../../common';

import { MessengerFriendsComposer } from '../../../outgoing';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerFriendsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_FRIENDS) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger()) await this.user.client().processComposer(new MessengerFriendsComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}