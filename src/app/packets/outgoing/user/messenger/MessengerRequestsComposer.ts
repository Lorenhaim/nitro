import { Logger } from '../../../../common';
import { User } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRequestsComposer extends Outgoing
{
    constructor(_user: User)
    {
        super(OutgoingHeader.MESSENGER_REQUESTS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.messenger())
            {
                const totalFriendRequests = this.user.messenger().friendRequests.length;

                if(totalFriendRequests)
                {
                    this.packet.writeInt(totalFriendRequests);
                    this.packet.writeInt(totalFriendRequests);
    
                    for(let i = 0; i < totalFriendRequests; i++)
                    {
                        const request = this.user.messenger().friendRequests[i];
    
                        this.packet.writeInt(request.userId);
                        this.packet.writeString(request.username);
                        this.packet.writeString(request.figure);
                    }
                }
                else
                {
                    this.packet.writeInt(0);
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

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}