import { CatalogItem } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogSearchComposer extends Outgoing
{
    private _item: CatalogItem;

    constructor(item: CatalogItem)
    {
        super(OutgoingHeader.CATALOG_SEARCH);

        if(!(item instanceof CatalogItem)) throw new Error('invalid_item');

        this._item = item;
    }

    public compose(): OutgoingPacket
    {
        return this._item.parseItem(this.packet).prepare();
    }
}