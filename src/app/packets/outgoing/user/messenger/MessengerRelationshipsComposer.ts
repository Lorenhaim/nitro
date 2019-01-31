import { Emulator } from '../../../../Emulator';
import { Logger } from '../../../../common';
import { User } from '../../../../game';

import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRelationshipsComposer extends Outgoing
{
    constructor(_user: User, private readonly _userId: number)
    {
        super(OutgoingHeader.MESSENGER_RELATIONSHIPS, _user);
    }

    public async compose(): Promise<OutgoingPacket>
    {
        try
        {
            if(this.user.isAuthenticated && this._userId)
            {
                const userInstance = await Emulator.gameManager().userManager().getUser(this._userId);

                if(userInstance)
                {
                    this.packet.writeInt(this._userId);

                    if(userInstance.messenger())
                    {
                        const relationships = await userInstance.messenger().getRelationships();

                        const totalLovers   = relationships.lovers ? relationships.lovers.length : 0;
                        const totalFriends  = relationships.friends ? relationships.friends.length : 0;
                        const totalHaters   = relationships.haters ? relationships.haters.length : 0;

                        let total = 0;
                        if(totalLovers) total++;
                        if(totalFriends) total++;
                        if(totalHaters) total++;

                        this.packet.writeInt(total);

                        if(totalLovers)
                        {
                            this.packet.writeInt(1);
                            this.packet.writeInt(totalLovers);

                            for(let i = 0; i < totalLovers; i++)
                            {
                                const lover = relationships.lovers[i];

                                this.packet.writeInt(lover.userId);
                                this.packet.writeString(lover.username);
                                this.packet.writeString(lover.figure);
                            }
                        }

                        if(totalFriends)
                        {
                            this.packet.writeInt(2);
                            this.packet.writeInt(totalFriends);

                            for(let i = 0; i < totalFriends; i++)
                            {
                                const friend = relationships.friends[i];

                                this.packet.writeInt(friend.userId);
                                this.packet.writeString(friend.username);
                                this.packet.writeString(friend.figure);
                            }
                        }

                        if(totalHaters)
                        {
                            this.packet.writeInt(3);
                            this.packet.writeInt(totalHaters);

                            for(let i = 0; i < totalHaters; i++)
                            {
                                const hater = relationships.friends[i];

                                this.packet.writeInt(hater.userId);
                                this.packet.writeString(hater.username);
                                this.packet.writeString(hater.figure);
                            }
                        }
                    }
                    else
                    {
                        this.packet.writeInt(0);
                    }

                    this.packet.prepare();

                    return this.packet;
                }
                else
                {
                    return this.cancel();
                }
            }
            else
            {
                return this.cancel();
            }
        }

        catch(err)
        {
            Logger.writeWarning(`Outgoing Composer Failed [${ this.packet.header }] -> ${ err.message || err }`);
        }
    }
}