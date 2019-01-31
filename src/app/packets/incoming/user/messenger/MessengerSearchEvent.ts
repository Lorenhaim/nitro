import { Emulator } from '../../../../Emulator';
import { Logger } from '../../../../common';

import { MessengerSearchComposer } from '../../../outgoing';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerSearchEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_SEARCH) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger())
            {
                const results = await Emulator.gameManager().userManager().searchUsers(this.packet.readString());

                if(results) await this.user.client().processComposer(new MessengerSearchComposer(this.user, results));
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}