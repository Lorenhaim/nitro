import { Logger } from '../../../../common';
import { User } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerFriendsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.MESSENGER_FRIENDS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.messenger())
            {
                if(this.user.messenger().isLoaded)
                {
                    this.packet.writeInt(1); // page count
                    this.packet.writeInt(1); // current page

                    const totalFriends = this.user.messenger().friends.length;

                    if(totalFriends)
                    {
                        this.packet.writeInt(totalFriends);

                        for(let i = 0; i < totalFriends; i++)
                        {
                            const friend = this.user.messenger().friends[i];

                            this.packet.writeInt(friend.userId); // if group 0
                            this.packet.writeString(friend.username); // group name
                            this.packet.writeInt(friend.gender === 'M' ? 0 : 1); //group 0
                            this.packet.writeBoolean(friend.online);
                            this.packet.writeBoolean(false); // inroom / following enabled
                            this.packet.writeString(friend.figure); // group badge
                            this.packet.writeInt(friend.categoryId); // category id
                            this.packet.writeString(friend.motto);
                            this.packet.writeString('');
                            this.packet.writeString('');
                            this.packet.writeBoolean(false); // allow offline messaging
                            this.packet.writeBoolean(false);
                            this.packet.writeBoolean(false); // has pocket habbo
                            this.packet.writeShort(friend.relation);
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