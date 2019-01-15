import { Logger } from '../../../common';

import { MessengerInitComposer, MessengerFriendsComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class MessengerInitEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_INIT) throw new Error('invalid_header');

            await this.user.client().processComposer(new MessengerInitComposer(this.user));
            await this.user.client().processComposer(new MessengerFriendsComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}