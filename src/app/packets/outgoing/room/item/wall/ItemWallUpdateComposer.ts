import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemWallUpdateComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ITEM_WALL_UPDATE);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this._item.parseWallData(this.packet);

            return this.packet.writeString(this._item.userId.toString()).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}