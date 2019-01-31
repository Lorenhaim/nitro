import { Logger } from '../../../../common';

import { MessengerUpdateComposer } from '../../../outgoing';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerUpdatesEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_UPDATES) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger()) await this.user.messenger().composeUpdates();

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}