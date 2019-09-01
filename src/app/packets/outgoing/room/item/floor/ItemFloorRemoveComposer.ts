import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ItemFloorRemoveComposer extends Outgoing
{
    private _item: Item;
    private _animateRemoval: boolean;

    constructor(item: Item, animateRemoval: boolean = true)
    {
        super(OutgoingHeader.ITEM_FLOOR_REMOVE);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item              = item;
        this._animateRemoval    = animateRemoval ? false : true;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeString(this._item.id.toString())
            .writeBoolean(this._animateRemoval) // if true do not 'fly / animate' to inventory
            .writeInt(this._item.userId, 0)
            .prepare();
    }
}