import { Badge } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserBadgeAddComposer extends Outgoing
{
    private _badge: Badge;

    constructor(badge: Badge)
    {
        super(OutgoingHeader.USER_BADGES_ADD);

        if(!badge) throw new Error('invalid_badge');

        this._badge = badge;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this._badge.slotNumber)
            .writeString(this._badge.badgeCode)
            .prepare();
    }
}