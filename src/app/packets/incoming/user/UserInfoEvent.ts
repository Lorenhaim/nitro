import { UserInfoComposer, UserPerksComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(
                new UserInfoComposer(),
                new UserPerksComposer());
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