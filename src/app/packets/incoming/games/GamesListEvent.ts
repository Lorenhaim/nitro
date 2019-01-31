import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class GamesListEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.GAMES_LIST) throw new Error('invalid_header');

            if(!this.user.isAuthenticated) throw new Error('invalid_authentication');

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}