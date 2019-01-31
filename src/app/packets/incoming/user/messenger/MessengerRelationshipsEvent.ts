import { Logger } from '../../../../common';

import { MessengerRelationshipsComposer } from '../../../outgoing';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerRelationshipsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_RELATIONSHIPS) throw new Error('invalid_header');

            if(this.user.isAuthenticated) await this.user.client().processComposer(new MessengerRelationshipsComposer(this.user, this.packet.readInt()));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}