import { MessengerRequestsComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerRequestsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new MessengerRequestsComposer());
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