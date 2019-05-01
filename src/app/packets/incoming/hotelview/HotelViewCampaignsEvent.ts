import { HotelViewCampaignComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class HotelViewCampaignsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const something = this.packet.readString();

            this.client.processOutgoing(new HotelViewCampaignComposer());
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