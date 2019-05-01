import { UserClubComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserClubEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserClubComposer());
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