import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerFriendsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MESSENGER_FRIENDS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeInt(1); // page count
            this.packet.writeInt(1); // current page

            const friends = this.client.user.messenger.friends;

            if(!friends) return this.packet.writeInt(0).prepare();
            
            const totalFriends = friends.length;

            if(!totalFriends) return this.packet.writeInt(0).prepare();
            
            this.packet.writeInt(totalFriends);

            for(let i = 0; i < totalFriends; i++)
            {
                const friend = friends[i];

                if(!friend) continue;

                friend.parseFriend(this.packet);
            }
            
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}