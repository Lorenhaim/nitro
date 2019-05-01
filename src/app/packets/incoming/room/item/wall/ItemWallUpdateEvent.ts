import { Incoming } from '../../../Incoming';

export class ItemWallUpdateEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            currentRoom.itemManager.moveItem(this.client.user, item, <any> this.packet.readString());
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