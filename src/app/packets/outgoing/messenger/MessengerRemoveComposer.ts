import { Logger } from '../../../common';
import { User, MessengerFriend } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerRemoveComposer extends Outgoing
{
    constructor(_user: User, private readonly _userIds: number[])
    {
        super(OutgoingHeader.MESSENGER_UPDATE, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            this.packet.writeInt(0);

            if(this._userIds && this._userIds.length > 0)
            {
                this.packet.writeInt(this._userIds.length);

                for(const userId of this._userIds)
                {
                    this.packet.writeInt(-1);
                    this.packet.writeInt(userId);
                }
            }
            else
            {
                this.packet.writeInt(0);
            }

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}