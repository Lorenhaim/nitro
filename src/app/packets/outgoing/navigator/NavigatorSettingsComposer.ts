import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorSettingsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.NAVIGATOR_SETTINGS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                this.packet.writeInt(this.user.info().navigatorX);
                this.packet.writeInt(this.user.info().navigatorY);
                this.packet.writeInt(this.user.info().navigatorWidth);
                this.packet.writeInt(this.user.info().navigatorHeight);
                this.packet.writeBoolean(this.user.info().navigatorSearchOpen);
                this.packet.writeInt(0); // ??

                this.packet.prepare();

                return this.packet;
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}