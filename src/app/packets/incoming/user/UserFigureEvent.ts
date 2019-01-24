import { Logger } from '../../../common';

import { UserFigureComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class UserFigureEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.USER_FIGURE) throw new Error('invalid_header');

            const gender    = this.packet.readString() === 'M' ? 'M' : 'F';
            const figure    = this.packet.readString();

            await this.user.updateFigure(gender, figure);
            
            await this.user.client().processComposer(new UserFigureComposer(this.user));

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}