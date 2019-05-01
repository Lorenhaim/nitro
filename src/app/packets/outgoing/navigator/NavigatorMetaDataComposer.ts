import { Emulator } from '../../../Emulator';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class NavigatorMetaDataComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.NAVIGATOR_METADATA);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(Emulator.gameManager.navigatorManager.isLoaded)
            {
                const tabs      = Emulator.gameManager.navigatorManager.tabs;
                const totalTabs = tabs.length;

                if(tabs && totalTabs)
                {
                    this.packet.writeInt(totalTabs);

                    for(let i = 0; i < totalTabs; i++)
                    {
                        const tab = tabs[i];

                        this.packet.writeString(tab.name).writeInt(0);
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