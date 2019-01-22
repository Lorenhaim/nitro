import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { NavigatorCollapsedComposer, NavigatorEventCategoriesComposer, NavigatorLiftedRoomsComposer, NavigatorMetaDataComposer, NavigatorSavedSearchesComposer, NavigatorSettingsComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class NavigatorInitEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.NAVIGATOR_INIT) throw new Error('invalid_header');

            await this.user.client().processComposer(new NavigatorSettingsComposer(this.user));
            await this.user.client().processComposer(new NavigatorMetaDataComposer(this.user));
            await this.user.client().processComposer(new NavigatorLiftedRoomsComposer(this.user));
            await this.user.client().processComposer(new NavigatorCollapsedComposer(this.user));
            await this.user.client().processComposer(new NavigatorSavedSearchesComposer(this.user));
            await this.user.client().processComposer(new NavigatorEventCategoriesComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}