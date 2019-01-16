import { Logger } from '../../../common';
import { User, MessengerFriend } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerUpdateComposer extends Outgoing
{
    constructor(_user: User, private readonly _friends: MessengerFriend[])
    {
        super(OutgoingHeader.MESSENGER_UPDATE, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            this.packet.writeInt(0);

            if(this._friends && this._friends.length > 0)
            {
                this.packet.writeInt(this._friends.length);

                for(const friend of this._friends)
                {
                    this.packet.writeInt(0);
                    this.packet.writeInt(friend.friendId);
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
                    this.packet.writeShort(friend.relation);
                }
            }
            else
            {
                this.packet.writeInt(0);
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