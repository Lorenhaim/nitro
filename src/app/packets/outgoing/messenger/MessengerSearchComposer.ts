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

            const totalResults = this._results.length;

            if(!totalResults)
            {
                this.packet.writeInt(0);
                this.packet.writeInt(0);
            }
            else
            {
                const friends   = [];
                const users     = [];

                for(let i = 0; i < totalResults; i++)
                {
                    const result = this._results[i];

                    if(result instanceof User && result.userId !== this.user.userId)
                    {
                        if(this.user.userMessenger().getFriend(result.userId)) friends.push(result);
                        else users.push(result);
                    }
                }

                const friendsLength = friends.length;
                const usersLength   = users.length;

                if(!friendsLength)
                {
                    this.packet.writeInt(0);
                }
                else
                {
                    this.packet.writeInt(friendsLength);

                    for(let i = 0; i < friendsLength; i++)
                    {
                        const friend = friends[i];

                        this.packet.writeInt(friend.userId);
                        this.packet.writeString(friend.username);
                        this.packet.writeString(friend.motto);
                        this.packet.writeBoolean(friend.online);
                        this.packet.writeBoolean(false);
                        this.packet.writeString('');
                        this.packet.writeInt(1);
                        this.packet.writeString(friend.figure);
                        this.packet.writeString('');
                    }
                }

                if(!usersLength)
                {
                    this.packet.writeInt(0);
                }
                else
                {
                    this.packet.writeInt(usersLength);

                    for(let i = 0; i < usersLength; i++)
                    {
                        const user = users[i];

                        this.packet.writeInt(user.userId);
                        this.packet.writeString(user.username);
                        this.packet.writeString(user.motto);
                        this.packet.writeBoolean(user.online);
                        this.packet.writeBoolean(false);
                        this.packet.writeString('');
                        this.packet.writeInt(1);
                        this.packet.writeString(user.figure);
                        this.packet.writeString('');
                    }
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