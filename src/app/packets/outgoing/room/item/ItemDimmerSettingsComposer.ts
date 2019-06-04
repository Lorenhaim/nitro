import { Item } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class ItemDimmerSettingsEvent extends Outgoing
{
    private _item: Item;

    constructor(item: Item)
    {
        super(OutgoingHeader.ITEM_DIMMER_SETTINGS);

        if(!(item instanceof Item)) throw new Error('invalid_moodlight');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(3); // presets

        this.packet.writeInt(1); // enabled preset, 1 if none

        this.packet
            .writeInt(1) // preset id
            .writeInt(2) // if background only 2, else 1
            .writeString('#000000') // hex color
            .writeInt(255) // intensity

        this.packet
            .writeInt(2) // preset id
            .writeInt(2) // if background only 2, else 1
            .writeString('#000000') // hex color
            .writeInt(255) // intensity

        this.packet
            .writeInt(3) // preset id
            .writeInt(2) // if background only 2, else 1
            .writeString('#000000') // hex color
            .writeInt(255) // intensity

        return this.packet.prepare();
    }
}