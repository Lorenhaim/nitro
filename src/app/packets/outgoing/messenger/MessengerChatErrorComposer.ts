import { Logger } from '../../../common';
import { User, MessengerChatError } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerChatErrorComposer extends Outgoing
{
    constructor(_user: User, private readonly _error: MessengerChatError)
    {
        super(OutgoingHeader.MESSENGER_CHAT_ERROR, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger() || !this._error) return this.cancel();

            this.packet.writeInt(this._error);
            this.packet.writeInt(this.user.userId);
            this.packet.writeString(null);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}