import { Logger } from '../../../common';
import { User, FriendRequest } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerRequestComposer extends Outgoing
{
    constructor(_user: User, private readonly _request: FriendRequest)
    {
        super(OutgoingHeader.MESSENGER_REQUEST, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger() || !this._request) return this.cancel();

            this.packet.writeInt(this._request.userId);
            this.packet.writeString(this._request.username);
            this.packet.writeString(this._request.figure);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}