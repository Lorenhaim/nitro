import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { NavigatorSettingsComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class NavigatorRoomsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.NAVIGATOR_ROOMS) throw new Error('invalid_header');

            const view  = this.packet.readString();
            const query = this.packet.readString();

            console.log(view);
            console.log(query);

            //await this.user.client().processComposer(new NavigatorSettingsComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}