import { Incoming } from '../../../../Incoming';

export class ItemDimmerToggleEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(!this.client.user.unit.hasRights()) return;

            const dimmer = currentRoom.itemManager.dimmer;

            if(!dimmer) return;

            if(dimmer.extraData !== '0') dimmer.setExtraData(null);
            else dimmer.setExtraData('2,1,2,#FF00FF,255');

            //return this.client.user.connections.processOutgoing(new ItemDimmerSettingsEvent(dimmer))
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