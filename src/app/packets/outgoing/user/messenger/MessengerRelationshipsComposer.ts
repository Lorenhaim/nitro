import { Emulator } from '../../../../Emulator';
import { MessengerRelationshipType } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRelationshipsComposer extends Outgoing
{
    private _userId: number;

    constructor(userId: number)
    {
        super(OutgoingHeader.MESSENGER_RELATIONSHIPS);

        if(userId < 0) throw new Error('invalid_user_id');

        this._userId = userId;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const user = Emulator.gameManager.userManager.getUserById(this._userId);

            if(!user) return this.packet.writeInt(0, 0).prepare();
            
            this.packet.writeInt(this._userId);
            
            const relationships = user.messenger.getRelationships();

            if(!relationships) return this.packet.writeInt(0, 0).prepare();
            
            const totalLovers   = relationships.lovers.length;
            const totalFriends  = relationships.friends.length;
            const totalHaters   = relationships.haters.length;

            const total = totalLovers + totalFriends + totalHaters;

            if(!total) return this.packet.writeInt(0, 0).prepare();
            
            this.packet.writeInt(total);

            this.packet.writeInt(MessengerRelationshipType.LOVER);

            if(totalLovers)
            {
                this.packet.writeInt(totalLovers);
                
                for(let i = 0; i < totalLovers; i++)
                {
                    const lover = relationships.lovers[i];

                    this.packet.writeInt(lover.id).writeString(lover.username, lover.figure);
                }
            }
            else this.packet.writeInt(0);

            this.packet.writeInt(MessengerRelationshipType.FRIENDS);

            if(totalFriends)
            {
                this.packet.writeInt(totalFriends);
                
                for(let i = 0; i < totalFriends; i++)
                {
                    const friend = relationships.friends[i];

                    this.packet.writeInt(friend.id).writeString(friend.username, friend.figure);
                }
            }
            else this.packet.writeInt(0);

            this.packet.writeInt(MessengerRelationshipType.HATERS);

            if(totalHaters)
            {
                this.packet.writeInt(totalHaters);
                
                for(let i = 0; i < totalHaters; i++)
                {
                    const hater = relationships.haters[i];

                    this.packet.writeInt(hater.id).writeString(hater.username, hater.figure);
                }
            }
            else this.packet.writeInt(0);

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}