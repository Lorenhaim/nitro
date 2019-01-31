import { Logger } from '../../../../common';

import { Incoming } from '../../Incoming';
import { IncomingHeader } from '../../IncomingHeader';

export class MessengerDeclineEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_DECLINE) throw new Error('invalid_header');

            if(this.user.isAuthenticated && this.user.messenger())
            {
                const deleteAll = this.packet.readBoolean();

                if(deleteAll)
                {
                    await this.user.messenger().declineAllRequests();
                }
                else
                {
                    const totalToDecline = this.packet.readInt();

                    if(totalToDecline)
                    {
                        const requestorIds: number[] = [];

                        for(let i = 0; i < totalToDecline; i++) requestorIds.push(this.packet.readInt());

                        if(requestorIds) await this.user.messenger().declineRequest(requestorIds);
                    }
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