import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserBotsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_BOTS);
    }

    public compose(): OutgoingPacket
    {
        const bots = this.client.user.inventory.bots.bots;

        if(!bots) return this.packet.writeInt(0).prepare();

        const totalBots = bots.length;

        if(!totalBots) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalBots);
        
        for(let i = 0; i < totalBots; i++) bots[i].parseInventoryData(this.packet);
        
        return this.packet.prepare();
    }
}