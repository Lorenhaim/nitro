import { Logger } from '../../../../common';
import { User, MessengerFriendRequestError } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRequestErrorComposer extends Outgoing
{
    constructor(_user: User, private readonly _error: MessengerFriendRequestError)
    {
        super(OutgoingHeader.MESSENGER_REQUEST_ERROR, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this.user.messenger() && this._error)
            {
                this.packet.writeInt(0);
                this.packet.writeInt(this._error);

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