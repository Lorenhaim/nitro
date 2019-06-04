import { Badge } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserBadgesComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_BADGES);
    }

    public compose(): OutgoingPacket
    {
        const badges = this.client.user.inventory.badges.badges;

        if(!badges) return this.packet.writeInt(0, 0).prepare();

        const totalBadges = badges.length;

        if(!totalBadges) return this.packet.writeInt(0, 0).prepare();
        
        this.packet.writeInt(totalBadges);

        const currentBadges: Badge[] = [];

        for(let i = 0; i < totalBadges; i++)
        {
            const badge = badges[i];

            this.packet.writeInt(badge.id).writeString(badge.badgeCode);

            if(badge.slotNumber > 0) currentBadges.push(badge);
        }

        const totalCurrentBadges = currentBadges.length;

        if(totalCurrentBadges)
        {
            this.packet.writeInt(totalCurrentBadges);

            for(let i = 0; i < totalCurrentBadges; i++)
            {
                const badge = currentBadges[i];

                this.packet.writeInt(badge.slotNumber).writeString(badge.badgeCode);
            }
        }
        else this.packet.writeInt(0);
        
        return this.packet.prepare();
    }
}