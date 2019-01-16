import { Logger } from '../../../common';

import { MessengerRequestsComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class MessengerRequestsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_REQUESTS) throw new Error('invalid_header');

            if(!this.user.userMessenger()) throw new Error('invalid_messenger');

            await this.user.client().processComposer(new MessengerRequestsComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}