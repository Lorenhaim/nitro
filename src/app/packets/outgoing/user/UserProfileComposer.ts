import { Emulator } from '../../../Emulator';
import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserProfileComposer extends Outgoing
{
    constructor(_user: User, private readonly _userId: number)
    {
        super(OutgoingHeader.USER_PROFILE, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this._userId) return this.cancel();

            const profile = await Emulator.gameManager().userManager().getUser(this._userId);

            if(!profile) return this.cancel();

            this.packet.writeInt(profile.userId);
            this.packet.writeString(profile.username);
            this.packet.writeString(profile.figure);
            this.packet.writeString(profile.motto);
            this.packet.writeString(TimeHelper.formatDate(profile.timestampCreated, 'MMMM DD, YYYY'));

            if(profile.userInfo()) this.packet.writeInt(profile.userInfo().achievementScore);
            else this.packet.writeInt(0);

            if(profile.userMessenger()) this.packet.writeInt(profile.userMessenger().friends.length || 0);
            else this.packet.writeInt(0);

            if(this.user.userMessenger())
            {
                this.packet.writeBoolean(this.user.userMessenger().getFriend(profile.userId) ? true : false);
                this.packet.writeBoolean(this.user.userMessenger().getRequest(profile.userId) ? true : false);
            }
            else
            {
                this.packet.writeBoolean(false);
                this.packet.writeBoolean(false);
            }

            this.packet.writeBoolean(profile.online);
            this.packet.writeInt(0); // total groups
            this.packet.writeInt(TimeHelper.between(profile.lastOnline, TimeHelper.now, 'seconds'));
            this.packet.writeBoolean(true);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}