import { MessengerUpdate, MessengerUpdateType } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerUpdateComposer extends Outgoing
{
    private _updates: MessengerUpdate[];

    constructor(...updates: MessengerUpdate[])
    {
        super(OutgoingHeader.MESSENGER_UPDATE);

        this._updates = [ ...updates ];
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const categories = this.client.user.messenger.categories;

            if(categories)
            {
                const totalCategories = categories.length;

                if(totalCategories)
                {
                    this.packet.writeInt(totalCategories);

                    for(let i = 0; i < totalCategories; i++)
                    {
                        const category = this.client.user.messenger.categories[i];

                        if(!category) continue;

                        category.parseCategory(this.packet);
                    }
                }
                else this.packet.writeInt(0);
            }
            else this.packet.writeInt(0);

            const totalUpdates = this._updates.length;

            if(!totalUpdates) return this.packet.writeInt(0).prepare();
            
            this.packet.writeInt(totalUpdates);

            for(let i = 0; i < totalUpdates; i++)
            {
                const update = this._updates[i];

                if(!update) continue;

                this.packet.writeInt(update.type);
                
                if(update.type === MessengerUpdateType.REMOVE) this.packet.writeInt(update.friendId);

                else update.friend.parseFriend(this.packet);
            }
            
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}