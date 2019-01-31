import { Logger } from '../../../common';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserFigureEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_FIGURE) throw new Error('invalid_header');

            if(this.user.isAuthenticated) await this.user.updateFigure(<any> this.packet.readString(), this.packet.readString());

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}