import { Logger } from '../../../../common';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerRemoveEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_REMOVE) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger())
            {
                const totalToRemove = this.packet.readInt();

                if(totalToRemove)
                {
                    const friendIds: number[] = [];

                    for(let i = 0; i < totalToRemove; i++) friendIds.push(this.packet.readInt());

                    if(friendIds) await this.user.messenger().removeFriend(friendIds);
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