import { Incoming } from '../Incoming';

export class ClientLatencyEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const latency = this.packet.readInt();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}