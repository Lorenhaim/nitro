import { HotelViewComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class HotelViewEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.unit) this.client.user.unit.reset(false);

            if(this.client.user.unit.isSpectating) this.client.user.unit.spectate(false);

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