import { Logger } from '../../../common';

import { UserBadgesComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserCurrentBadgesEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_CURRENT_BADGES) throw new Error('invalid_header');

            const userId = this.packet.readInt();

            await this.user.client().processComposer(new UserBadgesComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}