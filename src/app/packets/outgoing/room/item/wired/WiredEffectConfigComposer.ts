import { Item } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class WiredEffectConfigComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.WIRED_EFFECT_CONFIG);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const interaction: any = this._item.baseItem.interaction;

            if(interaction && interaction.parseWiredData) interaction.parseWiredData(this._item, this.packet);

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}