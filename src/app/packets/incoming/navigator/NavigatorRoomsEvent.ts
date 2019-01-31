import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { NavigatorSearchComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class NavigatorRoomsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.NAVIGATOR_ROOMS) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                const view  = this.packet.readString();
                const query = this.packet.readString();

                await this.user.client().processComposer(new NavigatorSearchComposer(this.user));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}