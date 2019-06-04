import { ItemDimmerSettingsEvent } from '../../../../../outgoing';
import { Incoming } from '../../../../Incoming';

export class ItemDimmerSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const dimmer = currentRoom.itemManager.dimmer;

            if(!dimmer) return;

            const dimmerId          = this.packet.readInt();
            const backgroundOnly    = this.packet.readInt();
            const color             = this.packet.readString();
            const intensity         = this.packet.readInt();

            dimmer.setExtraData(`${ dimmerId },${ dimmerId },${ backgroundOnly }.${ color },${ intensity }`);
            
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