import { Logger } from '../../../../common';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerChatEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_CHAT) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger())
            {
                const receiverId    = this.packet.readInt();
                const message       = this.packet.readString();

                await this.user.messenger().sendMessage(receiverId, message);
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);

            return true;
        }
    }
}