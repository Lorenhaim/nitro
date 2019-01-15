import { Emulator } from '../../../Emulator';
import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class ClientReleaseVersionEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.RELEASE_VERSION) throw new Error('invalid_header');

            const releaseVersion: string = this.packet.readString();

            if(releaseVersion !== Emulator.config().getString('client.releaseVersion', 'PRODUCTION-201812272209-984739530')) throw new Error('invalid_release_version');

            return true;
        }

        catch(err)
        {
            await this.user.dispose();

            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}