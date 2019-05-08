import { InteractionExchange } from '../../../../game';
import { Incoming } from '../../Incoming';

export class ItemRedeemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;
            
            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            if(item.baseItem.hasInteraction(InteractionExchange))
            {
                const interaction = <InteractionExchange> item.baseItem.interaction;

                if(!interaction) return;

                if(interaction.onRedeem) await interaction.onRedeem(this.client.user.unit, item);

                // fix this
            }
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