import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class MessengerRequestEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_REQUEST) throw new Error('invalid_header');

            if(!this.user.userMessenger()) throw new Error('invalid_messenger');

            const user = await Emulator.gameManager().userManager().getUser(0, this.packet.readString());

            if(user)
            {
                await this.user.userMessenger().sendRequest(user.userId);
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}