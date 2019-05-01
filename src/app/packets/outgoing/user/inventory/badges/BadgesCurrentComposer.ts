import { Badge } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class BadgesCurrentComposer extends Outgoing
{
    private _userId: number;
    private _badges: Badge[]

    constructor(userId: number, ...badges: Badge[])
    {
        super(OutgoingHeader.USER_BADGES_CURRENT);

        if(!userId) throw new Error('invalid_current_badges');

        this._userId    = userId;
        this._badges    = [ ...badges ];
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeInt(this._userId);

            const totalCurrentBadges = this._badges.length;

            if(totalCurrentBadges)
            {
                this.packet.writeInt(totalCurrentBadges);

                for(let i = 0; i < totalCurrentBadges; i++)
                {
                    const badge = this._badges[i];

                    this.packet.writeInt(badge.slotNumber).writeString(badge.badgeCode);
                }

                return this.packet.prepare();
            }
            
            return this.packet.writeInt(0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}