import { WiredTrigger } from '../../../../../game';
import { WiredSaveComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class WiredTriggerSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(!this.client.user.unit.hasRights()) return;

            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            const interaction = <WiredTrigger> item.baseItem.interaction;

            if(!interaction) return;

            if(interaction.saveWiredData) interaction.saveWiredData(item, this.packet);

            this.client.processOutgoing(new WiredSaveComposer());
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