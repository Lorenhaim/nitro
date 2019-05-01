import { HotelViewComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class HotelViewEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.unit) await this.client.user.unit.reset(false);

            this.client.processOutgoing(new HotelViewComposer());
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