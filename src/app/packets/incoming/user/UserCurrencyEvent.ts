import { CurrencyComposer, CurrencyCreditsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserCurrencyEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(
                new CurrencyCreditsComposer(),
                new CurrencyComposer());
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