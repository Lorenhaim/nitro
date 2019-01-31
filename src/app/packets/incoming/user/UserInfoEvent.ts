import { Logger } from '../../../common';

import { UserInfoComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserInfoEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_INFO) throw new Error('invalid_header');
            
            if(this.user.isAuthenticated) await this.user.client().processComposer(new UserInfoComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}