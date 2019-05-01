import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemWallRemoveComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ITEM_WALL_REMOVE);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item      = item;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeString(this._item.id.toString())
                .writeInt(this._item.userId)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}