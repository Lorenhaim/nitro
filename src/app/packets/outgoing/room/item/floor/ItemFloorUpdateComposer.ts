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
        this._item.parseItem(this.packet, 0);
        
        //this.packet.writeInt(-1, 0, this._item.userId);

        return this.packet.prepare();
    }
}