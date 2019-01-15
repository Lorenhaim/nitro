import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class ClientVariablesEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.CLIENT_VARIABLES) throw new Error('invalid_header');

            const unknown: number               = this.packet.readInt();
            const clientBasePath: string        = this.packet.readString();
            const clientVariablesPath: string   = this.packet.readString();

            return true;
        }

        catch(err)
        {
            await this.user.dispose();

            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}