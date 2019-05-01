import { HotelViewNewsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class HotelViewNewsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new HotelViewNewsComposer());
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}