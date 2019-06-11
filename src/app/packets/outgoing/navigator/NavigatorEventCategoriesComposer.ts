import { Nitro } from '../../../Nitro';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorEventCategoriesComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_EVENT_CATEGORIES);
    }

    public compose(): OutgoingPacket
    {
        const eventCategories = Nitro.gameManager.navigatorManager.eventCategories;

        if(!eventCategories) return this.packet.writeInt(0).prepare();
        
        const totalEventCategories  = eventCategories.length;

        if(!totalEventCategories) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalEventCategories);

        for(let i = 0; i < totalEventCategories; i++)
        {
            const eventCategory = eventCategories[i];

            this.packet
                .writeInt(eventCategory.id)
                .writeString(eventCategory.name)
                .writeBoolean(true); // ??
        }
        
        return this.packet.prepare();
    }
}