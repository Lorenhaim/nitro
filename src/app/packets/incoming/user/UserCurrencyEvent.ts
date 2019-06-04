import { UserCreditsComposer, UserCurrencyComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserCurrencyEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(
                new UserCreditsComposer(),
                new UserCurrencyComposer());
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