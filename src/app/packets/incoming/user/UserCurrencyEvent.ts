import { Logger } from '../../../common';

import { CurrencyCreditsComposer, CurrencyComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserCurrencyEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_CURRENCY) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                await this.user.client().processComposer(new CurrencyCreditsComposer(this.user));
                await this.user.client().processComposer(new CurrencyComposer(this.user));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}