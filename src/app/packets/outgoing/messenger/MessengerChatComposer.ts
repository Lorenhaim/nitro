import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerChatComposer extends Outgoing
{
    constructor(_user: User, private readonly _message: { userId: number, message: string, timestamp: Date })
    {
        super(OutgoingHeader.MESSENGER_CHAT, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger() || !this._message) return this.cancel();

            this.packet.writeInt(this._message.userId);
            this.packet.writeString(this._message.message);
            this.packet.writeInt(TimeHelper.between(this._message.timestamp, TimeHelper.now, 'seconds'));

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}