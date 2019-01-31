import { Logger } from '../../../../common';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerRelationshipUpdateEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_RELATIONSHIPS_UPDATE) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger()) await this.user.messenger().updateRelation(this.packet.readInt(), <any> this.packet.readInt());

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}