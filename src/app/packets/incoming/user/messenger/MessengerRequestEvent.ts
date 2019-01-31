import { Emulator } from '../../../../Emulator';
import { Logger } from '../../../../common';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerRequestEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_REQUEST) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger()) await this.user.messenger().sendRequest(0, this.packet.readString());

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}