import { InteractionClothing } from '../../../../game';
import { Incoming } from '../../Incoming';

export class ItemClothingRedeemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;
            
            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            const interaction = <InteractionClothing> item.baseItem.interaction;

            if(!(interaction instanceof InteractionClothing)) return;

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