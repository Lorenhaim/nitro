import { UserIgnoredComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserIgnoredEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserIgnoredComposer());
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