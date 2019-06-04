import { WiredTriggerStateChanged } from '../../../../../game';
import { Incoming } from '../../../Incoming';

export class ItemFloorClickEvent extends Incoming
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
            
            const interaction: any = item.baseItem.interaction;

            if(!interaction) return;
            
            if(interaction.onClick) interaction.onClick(this.client.user.unit, item, true);
            
            currentRoom.wiredManager.processTrigger(WiredTriggerStateChanged, item, this.client.user);
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