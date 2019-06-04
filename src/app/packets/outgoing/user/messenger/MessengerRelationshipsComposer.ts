import { NumberHelper } from '../../../../common';
import { MessengerRelationshipType, User } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRelationshipsComposer extends Outgoing
{
    private _user: User;

    constructor(user: User)
    {
        super(OutgoingHeader.MESSENGER_RELATIONSHIPS);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user = user;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeInt(this._user.id);

            const relationships = this._user.messenger.getRelationships();

            if(!relationships) return this.packet.writeInt(0).prepare();

            let total = 0;
            
            const totalLovers   = relationships.lovers.length;
            const totalFriends  = relationships.friends.length;
            const totalHaters   = relationships.haters.length;

            if(totalLovers) total++;
            if(totalFriends) total++;
            if(totalHaters) total++;

            if(!total) return this.packet.writeInt(0).prepare();
            
            this.packet.writeInt(total);

            if(totalLovers)
            {
                this.packet.writeInt(MessengerRelationshipType.LOVER);

                this.packet.writeInt(totalLovers);
                
                const lover = relationships.lovers[NumberHelper.randomNumber(0, totalLovers - 1)];

                this.packet.writeInt(lover.id).writeString(lover.username, lover.figure);
            }

            if(totalFriends)
            {
                this.packet.writeInt(MessengerRelationshipType.FRIENDS);

                this.packet.writeInt(totalFriends);

                const friend = relationships.friends[NumberHelper.randomNumber(0, totalFriends - 1)];
                
                this.packet.writeInt(friend.id).writeString(friend.username, friend.figure);
            }

            if(totalHaters)
            {
                this.packet.writeInt(MessengerRelationshipType.HATERS);

                this.packet.writeInt(totalHaters);

                const hater = relationships.haters[NumberHelper.randomNumber(0, totalHaters - 1)];
                
                this.packet.writeInt(hater.id).writeString(hater.username, hater.figure);
            }

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}