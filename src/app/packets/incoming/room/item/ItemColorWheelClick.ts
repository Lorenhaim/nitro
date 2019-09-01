import { InteractionDice } from '../../../../game';
import { Incoming } from '../../Incoming';

export class ItemColorWheelClickEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(!this.client.user.unit.canLocate) return;

            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;
            
            const interaction = <InteractionDice> item.baseItem.interaction;

            if(!(interaction instanceof InteractionDice)) return;

            interaction.onDiceClick(this.client.user.unit, item);
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