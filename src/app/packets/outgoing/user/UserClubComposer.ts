import { Emulator } from '../../../Emulator';
import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class UserClubComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.USER_CLUB, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeString('habbo_club');

            if(this.user.userInfo && Emulator.config().getBoolean('hotel.habbo.club.enabled', true))
            {
                const clubExpiration: Date = this.user.userInfo().clubExpiration;

                if(clubExpiration != null && clubExpiration >= TimeHelper.now)
                {
                    const clubRemaining = TimeHelper.timeBetween(clubExpiration, TimeHelper.now);

                    this.packet.writeInt(clubRemaining.days);
                    this.packet.writeInt(1);
                    this.packet.writeInt(clubRemaining.months);
                    this.packet.writeInt(clubRemaining.years);
                    this.packet.writeBoolean(true);
                    this.packet.writeBoolean(true);
                    this.packet.writeInt(0);
                    this.packet.writeInt(0);
                    this.packet.writeInt(TimeHelper.until(clubExpiration, 'seconds'));

                    this.packet.prepare();
                }
            }

            if(!this.packet.isPrepared)
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

                this.packet.prepare();
            }

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}