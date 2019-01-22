import { Logger } from '../../../common';
import { User, Friend } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerUpdateComposer extends Outgoing
{
    constructor(_user: User, private readonly _friends: Friend[])
    {
        super(OutgoingHeader.MESSENGER_UPDATE, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            this.packet.writeInt(0);

            const totalUpdates = this._friends.length;

            if(!totalUpdates)
            {
                this.packet.writeInt(0);
            }
            else
            {
                this.packet.writeInt(totalUpdates);

                for(let i = 0; i < totalUpdates; i++)
                {
                    const friend = this._friends[i];
                    
                    this.packet.writeInt(0);
                    this.packet.writeInt(friend.userId);
                    this.packet.writeString(friend.username);
                    this.packet.writeInt(friend.gender == 'M' ? 0 : 1);
                    this.packet.writeBoolean(friend.online);
                    this.packet.writeBoolean(false); // in room
                    this.packet.writeString(friend.figure);
                    this.packet.writeInt(0);
                    this.packet.writeString(friend.motto);
                    this.packet.writeString('');
                    this.packet.writeString('');
                    this.packet.writeBoolean(false);
                    this.packet.writeBoolean(false);
                    this.packet.writeBoolean(false);
                    this.packet.writeShort(parseInt(friend.relation));
                }
            }

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}