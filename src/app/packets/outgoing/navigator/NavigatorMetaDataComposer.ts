import { Nitro } from '../../../Nitro';
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
        const tabs = Nitro.gameManager.navigatorManager.tabs;

        if(!tabs) return this.packet.writeInt(0).prepare();

        const totalTabs = tabs.length;

        if(!totalTabs) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalTabs);
        
        for(let i = 0; i < totalTabs; i++)
        {
            const tab = tabs[i];

            this.packet.writeString(tab.name).writeInt(0);
        }
        
        return this.packet.prepare();
    }
}