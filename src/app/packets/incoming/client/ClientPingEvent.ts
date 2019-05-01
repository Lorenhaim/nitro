import { ClientPongComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class ClientPingEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const pingCount = this.packet.readInt();

            if(pingCount === this.client.pingCount)
            {
                this.client.processOutgoing(new ClientPongComposer());

                this.client.pingCount++;

                return;
            }
            
            //await this.client.dispose();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}