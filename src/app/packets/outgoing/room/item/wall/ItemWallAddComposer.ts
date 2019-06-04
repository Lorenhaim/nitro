import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemWallAddComposer extends Outgoing
{
    private _item: Item;
    private _username: string;

    constructor(item: Item, username: string)
    {
        super(OutgoingHeader.ITEM_WALL_ADD);

        if(!(item instanceof Item) || !username) throw new Error('invalid_item');

        this._item      = item;
        this._username  = username;
    }

    public compose(): OutgoingPacket
    {
        this._item.parseWallData(this.packet);
            
        return this.packet.writeString(this._username).prepare();
    }
}