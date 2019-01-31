import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserFirstLoginOfDayComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.FIRST_LOGIN_OF_DAY, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                if(this.user.statistics())
                {
                    this.packet.writeBoolean(this.user.statistics().isFirstLoginOfDay);
                }
                else
                {
                    this.packet.writeBoolean(false);
                }

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