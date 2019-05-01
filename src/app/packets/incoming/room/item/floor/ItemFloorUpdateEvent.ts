import { Position } from '../../../../../game';
import { Incoming } from '../../../Incoming';

export class ItemFloorUpdateEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const item = currentRoom.itemManager.getItem(this.packet.readInt());

            if(!item) return;

            const position = new Position(this.packet.readInt(), this.packet.readInt(), null, this.packet.readInt());

            currentRoom.itemManager.moveItem(this.client.user, item, position);
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