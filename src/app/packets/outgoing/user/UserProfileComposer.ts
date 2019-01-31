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
            if(this.user.isAuthenticated && this._userId)
            {
                const profile = await Emulator.gameManager().userManager().getUser(this._userId);

                if(profile)
                {
                    this.packet.writeInt(profile.userId);
                    this.packet.writeString(profile.username);
                    this.packet.writeString(profile.figure);
                    this.packet.writeString(profile.motto);
                    this.packet.writeString(TimeHelper.formatDate(profile.timestampCreated, 'MMMM DD, YYYY'));
                    this.packet.writeInt(profile.info().achievementScore);

                    if(profile.messenger() && this.user.messenger())
                    {
                        this.packet.writeInt(profile.messenger().friends.length); // get offline total
                        this.packet.writeBoolean(await this.user.messenger().hasFriend(profile.userId));
                        this.packet.writeBoolean(await profile.messenger().hasRequest(this.user.userId));
                    }
                    else
                    {
                        this.packet.writeInt(0);
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