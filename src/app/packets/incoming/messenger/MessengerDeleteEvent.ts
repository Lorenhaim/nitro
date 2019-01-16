import { Logger } from '../../../common';

import { MessengerRequestsComposer } from '../../outgoing';

import { Incoming } from '../Incoming';
import { IncomingHeader } from '../IncomingHeader';

export class MessengerDeleteEvent extends Incoming
{
    public async process(): Promise<boolean>
    {
        try
        {
            if(this.packet.header !== IncomingHeader.MESSENGER_DELETE) throw new Error('invalid_header');

            if(!this.user.userMessenger()) throw new Error('invalid_messenger');

            const total: number = this.packet.readInt();

            if(!total) throw new Error('nothing_to_delete');

            const friendIds: number[] = [];

            for(let i = 0; i < total; i++) friendIds.push(this.packet.readInt());

            await this.user.userMessenger().deleteFriends(friendIds);

            return true;
        }

        catch(err)
        {
            Logger.writeWarning(`Incoming Packet Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}