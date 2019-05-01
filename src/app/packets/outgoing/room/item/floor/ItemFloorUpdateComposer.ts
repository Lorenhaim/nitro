import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemFloorUpdateComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ITEM_FLOOR_UPDATE);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this._item.parseFloorData(this.packet);
            this.packet.writeInt(0);
            this._item.parseExtraData(this.packet);
            this.packet.writeInt(-1, 0, this._item.userId);

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}