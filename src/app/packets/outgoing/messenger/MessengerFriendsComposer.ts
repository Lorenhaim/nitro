import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

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
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            this.packet.writeInt(300);
            this.packet.writeInt(300);

            const totalFriends = this.user.userMessenger().friends.length;

            if(!totalFriends)
            {
                this.packet.writeInt(0);
            }
            else
            {
                this.packet.writeInt(totalFriends);

                for(let i = 0; i < totalFriends; i++)
                {
                    const friend = this.user.userMessenger().friends[i];

                    this.packet.writeInt(friend.userId);
                    this.packet.writeString(friend.username);
                    this.packet.writeInt(friend.gender === 'M' ? 0 : 1);
                    this.packet.writeBoolean(friend.online);
                    this.packet.writeBoolean(false); // inroom
                    this.packet.writeString(friend.figure);
                    this.packet.writeInt(0);
                    this.packet.writeString(friend.motto);
                    this.packet.writeString('');
                    this.packet.writeString('');
                    this.packet.writeBoolean(false); // allow offline messaging
                    this.packet.writeBoolean(false);
                    this.packet.writeBoolean(false);
                    this.packet.writeShort(parseInt(friend.relation));
                }
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