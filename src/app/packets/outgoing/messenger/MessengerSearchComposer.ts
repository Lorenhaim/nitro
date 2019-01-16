import { Logger, TimeHelper } from '../../../common';
import { User } from '../../../game';

import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class MessengerSearchComposer extends Outgoing
{
    constructor(_user: User, private readonly _results: User[])
    {
        super(OutgoingHeader.MESSENGER_SEARCH, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(!this.user.isAuthenticated || !this.user.userMessenger()) return this.cancel();

            if(this._results && this._results.length > 0)
            {
                const friends   = [];
                const users     = [];

                for(const user of this._results)
                {
                    if(user instanceof User)
                    {
                        if(this.user.userMessenger().getFriend(user.userId)) friends.push(user);
                        else users.push(user);
                    }
                }

                if(friends.length > 0)
                {
                    this.packet.writeInt(friends.length);

                    for(const friend of friends)
                    {
                        this.packet.writeInt(friend.userId);
                        this.packet.writeString(friend.username);
                        this.packet.writeString(friend.motto);
                        this.packet.writeBoolean(friend.online);
                        this.packet.writeBoolean(false);
                        this.packet.writeString('');
                        this.packet.writeInt(1);
                        this.packet.writeString(friend.online ? friend.figure : '');
                        this.packet.writeString('');
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                }

                if(users.length > 0)
                {
                    this.packet.writeInt(users.length);

                    for(const user of users)
                    {
                        this.packet.writeInt(user.userId);
                        this.packet.writeString(user.username);
                        this.packet.writeString(user.motto);
                        this.packet.writeBoolean(user.online);
                        this.packet.writeBoolean(false);
                        this.packet.writeString('');
                        this.packet.writeInt(1);
                        this.packet.writeString(user.online ? user.figure : '');
                        this.packet.writeString('');
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                }
            }
            else
            {
                this.packet.writeInt(0);
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