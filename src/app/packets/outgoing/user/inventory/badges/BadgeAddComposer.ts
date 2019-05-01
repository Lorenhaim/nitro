import { Badge } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class BadgeAddComposer extends Outgoing
{
    private _badge: Badge;

    constructor(badge: Badge)
    {
        super(OutgoingHeader.USER_BADGES_ADD);

        this._badge = {
            badgeCode: badge.badgeCode || null,
            slotNumber: badge.slotNumber || 0
        };

        if(!this._badge.badgeCode) throw new Error('invalid_badge_code');
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._badge.slotNumber)
                .writeString(this._badge.badgeCode)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}