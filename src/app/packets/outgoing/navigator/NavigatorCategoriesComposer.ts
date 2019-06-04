import { Emulator } from '../../../Emulator';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorCategoriesComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_CATEGORIES);
    }

    public compose(): OutgoingPacket
    {
        const categories = Emulator.gameManager.navigatorManager.categories;

        if(!categories) return this.packet.writeInt(0).prepare();
        
        const totalCategories = categories.length;

        if(!totalCategories) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalCategories);

        for(let i = 0; i < totalCategories; i++)
        {
            const category = categories[i];

            this.packet
                .writeInt(category.id)
                .writeString(category.name)
                .writeBoolean(true) // can access
                .writeBoolean(false)
                .writeString(null)
                .writeString(null)
                .writeBoolean(false);
        }
        
        return this.packet.prepare();
    }
}