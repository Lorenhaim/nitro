import { ClientLatencyComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class ClientLatencyEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            return this.client.processOutgoing(new ClientLatencyComposer(this.packet.readInt()));
        }

        catch(err)
        {
            this.error(err);
        }
    }
}