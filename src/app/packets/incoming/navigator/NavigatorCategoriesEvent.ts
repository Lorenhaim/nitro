import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { NavigatorCategoriesComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class NavigatorCategoriesEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.NAVIGATOR_CATEGORIES) throw new Error('invalid_header');

            if(this.user.isAuthenticated) await this.user.client().processComposer(new NavigatorCategoriesComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}