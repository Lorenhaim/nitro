import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemFloorAddComposer extends Outgoing
{
    private _item: Item;
    private _username: string;

    constructor(item: Item, username: string)
    {
        super(OutgoingHeader.ITEM_FLOOR_ADD);

        if(!(item instanceof Item) || !username) throw new Error('invalid_item');

        this._item      = item;
        this._username  = username;
    }

    public compose(): OutgoingPacket
    {
        this._item.parseItem(this.packet, 1);

        return this.packet.writeString(this._username).prepare();
    }
}