import { Emulator } from '../../../Emulator';
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
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded)
            {
                const eventCategories       = Emulator.gameManager.navigatorManager.eventCategories;
                const totalEventCategories  = eventCategories.length;

                if(eventCategories && totalEventCategories)
                {
                    this.packet.writeInt(totalEventCategories);

                    for(let i = 0; i < totalEventCategories; i++)
                    {
                        const eventCategory = eventCategories[i];

                        this.packet
                            .writeInt(eventCategory.id)
                            .writeString(eventCategory.name)
                            .writeBoolean(true); // ??
                    }
                }
                else
                {
                    this.packet.writeInt(0);
                }

                return this.packet.prepare();
            }

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}