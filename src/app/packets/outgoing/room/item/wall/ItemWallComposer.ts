import { BaseItemType, Room } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemWallComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ITEM_WALL);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        const itemOwners = this._room.objectOwners;

        if(itemOwners)
        {
            const totalOwners = itemOwners.length;

            if(totalOwners)
            {
                this.packet.writeInt(totalOwners);

                for(let i = 0; i < totalOwners; i++)
                {
                    const owner = itemOwners[i];

                    this.packet.writeInt(owner.id).writeString(owner.username);
                }
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);
        
        const items = this._room.itemManager.getItemsByType(BaseItemType.WALL);

        if(!items) return this.packet.writeInt(0).prepare();
        
        const totalItems = items.length;

        if(!totalItems) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalItems);

        for(let i = 0; i < totalItems; i++) items[i].parseItem(this.packet);
        
        return this.packet.prepare();
    }
}