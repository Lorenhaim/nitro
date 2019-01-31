import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserInfoComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.USER_INFO, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.info())
            {
                this.packet.writeInt(this.user.userId);
                this.packet.writeString(this.user.username);
                this.packet.writeString(this.user.figure);
                this.packet.writeString(this.user.gender);
                this.packet.writeString(this.user.motto);
                this.packet.writeString(this.user.username);
                this.packet.writeBoolean(false);
                this.packet.writeInt(this.user.info().respectsReceived);
                this.packet.writeInt(this.user.info().respectsRemaining);
                this.packet.writeInt(this.user.info().respectsPetRemaining);
                this.packet.writeBoolean(false);
                this.packet.writeString(TimeHelper.formatDate(this.user.timestampCreated, 'YYYY-MM-DD HH:mm:ss'));
                this.packet.writeBoolean(false); // name change
                this.packet.writeBoolean(false);

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