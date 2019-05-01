import { UserSettingsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserSettingsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserSettingsComposer());
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