import { Incoming } from '../../Incoming';

export class ItemPickupEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const unknown = this.packet.readInt();

            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            currentRoom.itemManager.removeItem(this.client.user, true, item);
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