import { MarketplaceConfigComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MarketplaceConfigEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new MarketplaceConfigComposer());
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