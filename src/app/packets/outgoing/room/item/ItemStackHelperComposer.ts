import { Item } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class ItemStackHelperComposer extends Outgoing
{
    private _item: Item;
    private _height: number;

    constructor(item: Item, height: number)
    {
        super(OutgoingHeader.ITEM_STACK_HELPER);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item      = item;
        this._height    = height;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._item.id, this._height).prepare();
    }
}