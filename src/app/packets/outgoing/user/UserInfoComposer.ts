import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class UserInfoComposer extends Outgoing
{
    constructor(user: User)
    {
        super(OutgoingHeader.USER_INFO, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeInt(this.user.userId);
            this.packet.writeString(this.user.username);
            this.packet.writeString(this.user.figure);
            this.packet.writeString(this.user.gender);
            this.packet.writeString(this.user.motto);
            this.packet.writeString(this.user.username);
            this.packet.writeBoolean(false);

            if(this.user.userInfo)
            {
                this.packet.writeInt(this.user.userInfo().respectsReceived);
                this.packet.writeInt(this.user.userInfo().respectsRemaining);
                this.packet.writeInt(this.user.userInfo().respectsPetRemaining);
            }
            else
            {
                this.packet.writeInt(0);
                this.packet.writeInt(0);
                this.packet.writeInt(0);
            }

            this.packet.writeBoolean(false);
            this.packet.writeString(TimeHelper.formatDate(this.user.timestampCreated, 'YYYY-MM-DD HH:mm:ss'));
            this.packet.writeBoolean(false); // name change
            this.packet.writeBoolean(false);

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}