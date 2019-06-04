import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemFloorRemoveComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ITEM_FLOOR_REMOVE);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeString(this._item.id.toString())
            .writeBoolean(false)
            .writeInt(this._item.userId, 0)
            .prepare();
    }
}