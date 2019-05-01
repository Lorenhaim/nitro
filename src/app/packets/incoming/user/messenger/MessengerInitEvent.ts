import { MessengerInitComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerInitEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new MessengerInitComposer());
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