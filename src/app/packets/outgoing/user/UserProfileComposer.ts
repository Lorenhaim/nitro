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
        this.packet
            .writeInt(this._user.id)
            .writeString(this._user.details.username, this._user.details.figure, this._user.details.motto, TimeHelper.formatDate(this._user.details.timestampCreated, 'MMMM DD, YYYY'))
            .writeInt(this._user.details.achievementScore)
            .writeInt(this._user.details.totalFriends) // totalfriends
            .writeBoolean(this.client.user.messenger.hasFriend(this._user.id))
            .writeBoolean(this.client.user.messenger.didRequest(this._user.id))
            .writeBoolean(this._user.details.online);

        const groups = this._user.inventory.groups.getGroups();

        if(groups)
        {
            const totalGroups = groups.length;

            if(totalGroups)
            {
                this.packet.writeInt(totalGroups);
                
                for(let i = 0; i < totalGroups; i++)
                {
                    const group = groups[i];

                    this.packet
                        .writeInt(group.id)
                        .writeString(group.name)
                        .writeString(group.badge)
                        .writeString('') // color 1
                        .writeString('') // color 2
                        .writeBoolean(this._user.details.favoriteGroupId === group.id)
                        .writeInt(group.userId)
                        .writeBoolean(group.isOwner(this._user));
                }
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);
        
        return this.packet
            .writeInt(TimeHelper.between(this._user.details.lastOnline, TimeHelper.now, 'seconds'))
            .writeBoolean(true)
            .prepare();
    }
}