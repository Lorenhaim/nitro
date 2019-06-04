import { Incoming } from '../Incoming';

export class HotelViewEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.unit) this.client.user.unit.reset();
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