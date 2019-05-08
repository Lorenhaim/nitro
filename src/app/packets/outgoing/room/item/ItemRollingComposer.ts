import { Item } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class ItemRollingComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ROLLING);

        if(!(item instanceof Item) || !item.rolling) throw new Error('invalid_roll');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet
                .writeInt(this._item.rolling.position.x)
                .writeInt(this._item.rolling.position.y)
                .writeInt(this._item.rolling.positionNext.x)
                .writeInt(this._item.rolling.positionNext.y)
                .writeInt(1)
                .writeInt(this._item.id)
                .writeString(this._item.rolling.position.z.toFixed(2))
                .writeString(this._item.rolling.positionNext.z.toFixed(2))
                .writeInt(this._item.rolling.roller.id)
                .prepare();

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}