import { Logger } from '../../../../../common';
import { User } from '../../../../../game';

import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class BadgesComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_BADGES, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                if(this.user.inventory() && this.user.inventory().badges() && this.user.inventory().badges().isLoaded)
                {
                    const totalBadges = this.user.inventory().badges().badges.length;

                    if(totalBadges)
                    {
                        this.packet.writeInt(totalBadges);
    
                        for(let i = 0; i < totalBadges; i++)
                        {
                            const badge = this.user.inventory().badges().badges[i];
    
                            this.packet.writeInt(badge.id);
                            this.packet.writeString(badge.badgeCode);
                        }
    
                        const totalCurrentBadges = this.user.inventory().badges().currentBadges.length;
    
                        if(totalCurrentBadges)
                        {
                            this.packet.writeInt(totalCurrentBadges);
    
                            for(let i = 0; i < totalCurrentBadges; i++)
                            {
                                const badge = this.user.inventory().badges().currentBadges[i];
    
                                this.packet.writeInt(badge.slotNumber);
                                this.packet.writeString(badge.badgeCode);
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
                        this.packet.writeInt(0);
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                    this.packet.writeInt(0);
                }

                this.packet.prepare();

                return this.packet;
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}