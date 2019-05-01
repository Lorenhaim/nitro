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
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded)
            {
                const categories        = Emulator.gameManager.navigatorManager.categories;
                const totalCategories   = categories.length;

                if(categories && totalCategories)
                {
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