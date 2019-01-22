import { Logger } from '../../../common';

import { UserSanctionStatusComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserSanctionStatusEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_SANCTION_STATUS) throw new Error('invalid_header');

            const unknown = this.packet.readBoolean();

            await this.user.client().processComposer(new UserSanctionStatusComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}