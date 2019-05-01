import { RecyclerPrizesComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RecyclerPrizesEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new RecyclerPrizesComposer());
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