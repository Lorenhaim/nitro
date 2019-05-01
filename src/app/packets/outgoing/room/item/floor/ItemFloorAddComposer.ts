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
        try
        {
            this._item.parseFloorData(this.packet);
            this.packet.writeInt(1)
            this._item.parseExtraData(this.packet);
            this.packet
                .writeInt(-1, this._item.baseItem.canToggle ? 1 : 0, this._item.userId)
                .writeString(this._username);

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}