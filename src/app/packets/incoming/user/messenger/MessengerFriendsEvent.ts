import { MessengerFriendsComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerFriendsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new MessengerFriendsComposer());
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