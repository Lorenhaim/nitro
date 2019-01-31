import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class NavigatorSettingsSaveEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.NAVIGATOR_SETTINGS_SAVE) throw new Error('invalid_header');

            if(this.user.isAuthenticated) this.user.info().updateNavigator(this.packet.readInt(), this.packet.readInt(), this.packet.readInt(), this.packet.readInt(), this.packet.readBoolean());

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}