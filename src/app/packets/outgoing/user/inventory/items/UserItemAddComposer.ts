import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserItemAddComposer extends Outgoing
{
    private _items: Item[];

    constructor(...items: Item[])
    {
        super(OutgoingHeader.USER_ITEM_ADD);

        if(!items) throw new Error('invalid_items');

        this._items = [ ... items ];
    }

    public compose(): OutgoingPacket
    {
        const totalItems = this._items.length;

        if(!totalItems) return this.packet.writeInt(1, 1, 0).prepare();
        
        this.packet.writeInt(1, 1, totalItems);
        
        for(let i = 0; i < totalItems; i++) this.packet.writeInt(this._items[i].id);

        return this.packet.prepare();
    }
}