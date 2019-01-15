import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';

export class UserProfileComposer extends Outgoing
{
    constructor(user: User, private readonly _userId: number)
    {
        super(OutgoingHeader.USER_PROFILE, user);

        if(!this.user.isAuthenticated) throw new Error('not_authenticated');
    }

    public async compose(): Promise<Buffer>
    {
        try
        {
            this.packet.writeInt(this.user.userId);
            this.packet.writeString(this.user.username);
            this.packet.writeString(this.user.figure);
            this.packet.writeString(this.user.motto);
            this.packet.writeString(TimeHelper.formatDate(this.user.timestampCreated, 'MMMM DD, YYYY'));
            this.packet.writeInt(0); // achievement score
            this.packet.writeInt(0); // total friends
            this.packet.writeBoolean(false); // is friends
            this.packet.writeBoolean(false); // is requested
            this.packet.writeBoolean(this.user.online);
            this.packet.writeInt(0); // total groups
            this.packet.writeInt(TimeHelper.between(this.user.lastOnline, TimeHelper.now, 'seconds')); // last online in seconds
            this.packet.writeBoolean(true);

            this.packet.prepare();

            return this.packet.buffer;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}