import { User } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserBadgesCurrentComposer extends Outgoing
{
    private _user: User;

    constructor(user: User)
    {
        super(OutgoingHeader.USER_BADGES_CURRENT);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user = user;
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(this._user.id);

        const totalCurrentBadges = this._user.inventory.badges.currentBadges.length;

        if(!totalCurrentBadges) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalCurrentBadges);
        
        for(let i = 0; i < totalCurrentBadges; i++)
        {
            const badge = this._user.inventory.badges.currentBadges[i];

            this.packet.writeInt(badge.slotNumber).writeString(badge.badgeCode);
        }

        return this.packet.prepare();
    }
}