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

            if(this.user.userMessenger().requests && this.user.userMessenger().requests.length > 0)
            {
                this.packet.writeInt(this.user.userMessenger().requests.length);
                this.packet.writeInt(this.user.userMessenger().requests.length);

                for(const request of this.user.userMessenger().requests)
                {
                    this.packet.writeInt(request.userId);
                    this.packet.writeString(request.username);
                    this.packet.writeString('');
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

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}