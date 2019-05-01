import { GiftConfigComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class GiftConfigEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new GiftConfigComposer());
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