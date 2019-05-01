import { Item } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class ItemStateComposer extends Outgoing
{
    private _item: Item;
    private _customState: number;

    constructor(item: Item, customState: number = null)
    {
        super(OutgoingHeader.ITEM_STATE);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item          = item;
        this._customState   = customState;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._item.id, this._customState !== null ? this._customState : parseInt(this._item.extraData)).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}