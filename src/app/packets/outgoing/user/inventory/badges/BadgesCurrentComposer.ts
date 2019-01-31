import { Emulator } from '../../../../../Emulator';
import { Logger } from '../../../../../common';
import { User } from '../../../../../game';

import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class BadgesCurrentComposer extends Outgoing
{
    constructor(_user: User, private readonly _userId: number)
    {
        super(OutgoingHeader.USER_BADGES_CURRENT, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated)
            {
                const userInstance = await Emulator.gameManager().userManager().getUser(this._userId);

                if(userInstance)
                {
                    this.packet.writeInt(this._userId);

                    if(userInstance.inventory() && userInstance.inventory().badges())
                    {
                        const currentBadges = await userInstance.inventory().badges().getCurrentBadges();
                        const totalBadges   = currentBadges.length;

                        if(currentBadges && totalBadges)
                        {
                            this.packet.writeInt(totalBadges);

                            for(let i = 0; i < totalBadges; i++)
                            {
                                const badge = currentBadges[i];

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
                    }

                    this.packet.prepare();

                    return this.packet;
                }
                else
                {
                    return this.cancel();
                }
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