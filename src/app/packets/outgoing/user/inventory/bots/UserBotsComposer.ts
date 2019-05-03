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
        try
        {
            const bots = this.client.user.inventory.bots.bots;

            if(bots)
            {
                const totalBots = bots.length;

                if(totalBots)
                {
                    this.packet.writeInt(totalBots);
                    
                    for(let i = 0; i < totalBots; i++) bots[i].parseInventoryData(this.packet);
                }
                else this.packet.writeInt(0);
            }
            else this.packet.writeInt(0);
            
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}