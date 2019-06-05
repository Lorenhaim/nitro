import { Incoming } from '../Incoming';

export class ClientLatencyMeasureEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            console.log(`Latency Measure ${ this.packet.readInt() }`);
        }

        catch(err)
        {
            this.error(err);
        }
    }
}