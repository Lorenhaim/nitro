import { TimeHelper } from '../../../common';
import { User } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserProfileComposer extends Outgoing
{
    private _user: User

    constructor(user: User)
    {
        super(OutgoingHeader.USER_PROFILE);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user = user;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._user.id)
                .writeString(this._user.details.username, this._user.details.figure, this._user.details.motto, TimeHelper.formatDate(this._user.details.timestampCreated, 'MMMM DD, YYYY'))
                .writeInt(this._user.details.achievementScore)
                .writeInt(0) // totalfriends
                .writeBoolean(this.client.user.messenger.hasFriend(this._user.id))
                .writeBoolean(this.client.user.messenger.didRequest(this._user.id))
                .writeBoolean(this._user.details.online)
                .writeInt(0) // total groups
                .writeInt(TimeHelper.between(this._user.details.lastOnline, TimeHelper.now, 'seconds'))
                .writeBoolean(true)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}