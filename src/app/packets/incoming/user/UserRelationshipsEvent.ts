import { Logger } from '../../../common';

import { UserProfileComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserRelationshipsEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_RELATIONSHIPS) throw new Error('invalid_header');

            if(this.user.isAuthenticated)
            {
                const userId = this.packet.readInt();
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}