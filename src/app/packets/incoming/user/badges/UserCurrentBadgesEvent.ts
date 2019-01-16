import { Logger } from '../../../../common';

import { UserProfileComposer } from '../../../outgoing';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class UserCurrentBadgesEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_BADGES) throw new Error('invalid_header');

            const userId = this.packet.readInt();

            await this.user.client().processComposer(new UserProfileComposer(this.user, userId));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}