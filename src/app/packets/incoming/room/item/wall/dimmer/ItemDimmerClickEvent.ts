import { ItemDimmerSettingsEvent } from '../../../../../outgoing';
import { Incoming } from '../../../../Incoming';

export class ItemDimmerClickEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const dimmer = currentRoom.itemManager.dimmer;

            if(!dimmer) return;
            
            return this.client.processOutgoing(new ItemDimmerSettingsEvent(dimmer));
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