import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class HomeRoomComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_HOME_ROOM, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userInfo) return this.cancel();

            this.packet.writeInt(this.user.userInfo().homeRoom || 0);
            this.packet.writeInt(0);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}