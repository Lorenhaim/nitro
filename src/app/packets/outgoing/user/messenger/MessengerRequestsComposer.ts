import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRequestsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MESSENGER_REQUESTS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const friendRequests = this.client.user.messenger.requests;

            if(!friendRequests) return this.packet.writeInt(0, 0).prepare();

            const totalFriendRequests = friendRequests.length;

            if(!totalFriendRequests) return this.packet.writeInt(0, 0).prepare();

            this.packet.writeInt(totalFriendRequests, totalFriendRequests);

            for(let i = 0; i < totalFriendRequests; i++)
            {
                const request = friendRequests[i];

                if(!request) continue;

                request.parseRequest(this.packet);
            }

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}