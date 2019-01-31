import { Logger } from '../../../../../common';
import { User, Badge } from '../../../../../game';

import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class BadgesAddComposer extends Outgoing
{
    constructor(_user: User, private readonly _badge: Badge)
    {
        super(OutgoingHeader.USER_BADGES_ADD, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this._badge)
            {
                this.packet.writeInt(this._badge.slotNumber);
                this.packet.writeString(this._badge.badgeCode);

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