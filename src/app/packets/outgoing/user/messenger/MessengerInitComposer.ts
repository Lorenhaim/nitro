import { Nitro } from '../../../../Nitro';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerInitComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MESSENGER_INIT);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeInt(Nitro.config.game.messenger.maxFriends);
            this.packet.writeInt(0);
            this.packet.writeInt(Nitro.config.game.messenger.maxFriendsHabboClub);

            const categories = this.client.user.messenger.categories;

            if(!categories) return this.packet.writeInt(0).prepare();
            
            const totalCategories = categories.length;

            if(!totalCategories) return this.packet.writeInt(0).prepare();
            
            this.packet.writeInt(totalCategories);

            for(let i = 0; i < totalCategories; i++)
            {
                const category = this.client.user.messenger.categories[i];

                if(!category) continue;

                category.parseCategory(this.packet);
            }
            
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}