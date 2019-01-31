import { Logger } from '../../../common';

import { UserIgnoredComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserIgnoredEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_IGNORED) throw new Error('invalid_header');

            if(this.user.isAuthenticated) await this.user.client().processComposer(new UserIgnoredComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}