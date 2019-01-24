import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class FirstLoginOfDayComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.FIRST_LOGIN_OF_DAY, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated || !this.user.userStatistics()) return this.cancel();

            this.packet.writeBoolean(this.user.userStatistics().isFirstLoginOfDay);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}