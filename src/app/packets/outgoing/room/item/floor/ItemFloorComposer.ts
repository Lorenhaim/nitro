import { Room } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemFloorComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ITEM_FLOOR);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const itemOwners = this._room.itemManager.itemOwners;

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

                    const items = this._room.itemManager.getFloorItems();
                    
                    if(items)
                    {
                        const totalItems = items.length;

                        if(totalItems)
                        {
                            this.packet.writeInt(totalItems);

                            for(let i = 0; i < totalItems; i++)
                            {
                                const item = items[i];

                                item.parseFloorData(this.packet);
                                this.packet.writeInt(1)
                                item.parseExtraData(this.packet);
                                this.packet.writeInt(-1, item.baseItem.canToggle ? 1 : 0, item.userId); // 2nd is usable
                            }

                            return this.packet.prepare();
                        }
                    }
                }
            }

            return this.packet.writeInt(0, 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}