import { Emulator } from '../../../Emulator';
import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserClubComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_CLUB, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userInfo) return this.cancel();

            this.packet.writeString('habbo_club');

            const clubExpiration: Date = this.user.userInfo().clubExpiration;

            if(clubExpiration == null || clubExpiration <= TimeHelper.now)
            {
                this.packet.writeInt(0);
                this.packet.writeInt(0);
                this.packet.writeInt(0);
                this.packet.writeInt(0);
                this.packet.writeBoolean(true);
                this.packet.writeBoolean(true);
                this.packet.writeInt(0);
                this.packet.writeInt(0);
                this.packet.writeInt(0);
            }
            else
            {
                const clubRemaining = TimeHelper.timeBetween(clubExpiration, TimeHelper.now);

                this.packet.writeInt(clubRemaining.days);
                this.packet.writeInt(2);
                this.packet.writeInt(clubRemaining.months);
                this.packet.writeInt(clubRemaining.years);
                this.packet.writeBoolean(true);
                this.packet.writeBoolean(true);
                this.packet.writeInt(0);
                this.packet.writeInt(0);
                this.packet.writeInt(TimeHelper.until(clubExpiration, 'seconds'));
            }

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}