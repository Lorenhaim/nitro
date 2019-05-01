import { TimeHelper } from '../../../common';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserClubComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CLUB);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeString('club_habbo');

            if(this.client.user.details.clubActive)
            {
                const clubExpiration = this.client.user.details.clubExpiration;

                const remaining = TimeHelper.timeBetween(TimeHelper.now, clubExpiration);

                return this.packet
                    .writeInt(remaining.days, 1, remaining.months, remaining.years)
                    .writeBoolean(true, true)
                    .writeInt(0, 0, TimeHelper.until(clubExpiration, 'seconds'))
                    .prepare();
            }
            else
            {
                return this.packet
                    .writeInt(0, 7, 0, 1)
                    .writeBoolean(true, true)
                    .writeInt(0, 0, 0)
                    .prepare();
            }
        }

        catch(err)
        {
            this.error(err);
        }
    }
}