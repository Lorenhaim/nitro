import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class BadgesComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_BADGES);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const badges = this.client.user.inventory.badges.badges;
                
            if(badges)
            {
                const totalBadges = badges.length;

                if(totalBadges)
                {
                    this.packet.writeInt(totalBadges);

                    for(let i = 0; i < totalBadges; i++)
                    {
                        const badge = badges[i];

                        this.packet.writeInt(badge.id).writeString(badge.badgeCode);
                    }

                    const currentBadges = this.client.user.inventory.badges.currentBadges;

                    if(currentBadges)
                    {
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
                        else
                        {
                            this.packet.writeInt(0);
                        }
                    }
                    else
                    {
                        this.packet.writeInt(0);
                    }

                    return this.packet.prepare();
                }
            }

            return this.packet.writeInt(0, 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}