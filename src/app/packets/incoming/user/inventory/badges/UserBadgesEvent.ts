import { UserBadgesComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class UserBadgesEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserBadgesComposer());
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