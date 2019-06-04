import { UserOutfitsComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class OutfitsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserOutfitsComposer());
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