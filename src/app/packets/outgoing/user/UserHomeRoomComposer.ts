import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserHomeRoomComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_HOME_ROOM, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.info())
            {
                this.packet.writeInt(this.user.info().homeRoom || 0);
                this.packet.writeInt(0);

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