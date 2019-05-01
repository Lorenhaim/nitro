import { DiscountConfigComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class DiscountConfigEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new DiscountConfigComposer());
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