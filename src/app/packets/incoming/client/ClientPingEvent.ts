import { Logger } from '../../../common';

import { ClientPongComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class ClientPingEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.CLIENT_PING) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                const pingCount = this.packet.readInt();

                this.user.client()._pingCount = this.user.client()._pingCount === null ? 0 : this.user.client()._pingCount + 1;

                await this.user.client().processComposer(new ClientPongComposer(this.user));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}