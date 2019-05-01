import { Item, ItemRolling } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class ItemRollingComposer extends Outgoing
{
    private _item: Item;
    private _rollingData: ItemRolling;

    constructor(item: Item)
    {
        super(OutgoingHeader.ROLLING);

        if(!(item instanceof Item) || !item.rolling) throw new Error('invalid_roll');

        this._item          = item;
        this._rollingData   = item.rolling.copy();

        item.rolling = null;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet
                .writeInt(this._rollingData.position.x)
                .writeInt(this._rollingData.position.y)
                .writeInt(this._rollingData.positionNext.x)
                .writeInt(this._rollingData.positionNext.y)
                .writeInt(1)
                .writeInt(this._item.id)
                .writeString(this._rollingData.position.z.toFixed(2))
                .writeString(this._rollingData.positionNext.z.toFixed(2))
                .writeInt(this._rollingData.roller.id)
                .prepare();

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}