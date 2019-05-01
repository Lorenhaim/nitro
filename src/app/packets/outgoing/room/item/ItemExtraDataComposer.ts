import { Item } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class ItemExtraDataComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ITEM_EXTRA_DATA);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeString(this._item.id.toString());

            this._item.parseExtraData(this.packet);

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}