import { Logger } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

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
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            const totalRequests = this.user.userMessenger().requests.length;

            if(!totalRequests)
            {
                this.packet.writeInt(0);
                this.packet.writeInt(0);
            }
            else
            {
                this.packet.writeInt(totalRequests);
                this.packet.writeInt(totalRequests);

                for(let i = 0; i < totalRequests; i++)
                {
                    const request = this.user.userMessenger().requests[i];

                    this.packet.writeInt(request.userId);
                    this.packet.writeString(request.username);
                    this.packet.writeString(request.figure);
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