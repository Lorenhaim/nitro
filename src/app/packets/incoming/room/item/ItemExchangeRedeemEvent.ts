import { InteractionExchange } from '../../../../game';
import { Incoming } from '../../Incoming';

export class ItemExchangeRedeemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;
            
            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            const interaction = <InteractionExchange> item.baseItem.interaction;

            if(!(interaction instanceof InteractionExchange)) return;

            await interaction.onRedeem(this.client.user, item);
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}