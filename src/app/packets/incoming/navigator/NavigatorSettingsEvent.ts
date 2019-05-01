import { NavigatorSettingsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class NavigatorSettingsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new NavigatorSettingsComposer());
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