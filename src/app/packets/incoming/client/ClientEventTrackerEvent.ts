import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class ClientEventTrackerEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.EVENT_TRACKER) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                const unknown1   = this.packet.readString();
                const unknown2   = this.packet.readString();
                const unknown3   = this.packet.readString();
                const unknown4   = this.packet.readString();
                const unknown5   = this.packet.readInt();
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}