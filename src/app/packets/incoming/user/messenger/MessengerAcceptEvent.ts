import { Logger } from '../../../../common';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerAcceptEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_ACCEPT) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger())
            {
                const totalToAccept = this.packet.readInt();

                if(totalToAccept)
                {
                    const requestorIds: number [] = [];

                    for(let i = 0; i < totalToAccept; i++) requestorIds.push(this.packet.readInt());

                    if(requestorIds) await this.user.messenger().acceptRequest(requestorIds);
                }
            }

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}