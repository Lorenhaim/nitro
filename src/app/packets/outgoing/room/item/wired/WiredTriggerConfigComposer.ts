import { Item, WiredTrigger } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class WiredTriggerConfigComposer extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.WIRED_TRIGGER_CONFIG);

        if(!(item instanceof Item)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        const interaction = <WiredTrigger> this._item.baseItem.interaction;

        if(!(interaction instanceof WiredTrigger)) return this.cancel();
        
        return interaction.parseWiredData(this._item, this.packet).prepare();
    }
}