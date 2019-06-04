import { CatalogLayouts, CatalogPage } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogPageComposer extends Outgoing
{
    private _page: CatalogPage;
    private _mode: string;

    constructor(page: CatalogPage, mode: string)
    {
        super(OutgoingHeader.CATALOG_PAGE);

        if(!(page instanceof CatalogPage)) throw new Error('invalid_catalog_page');

        this._page  = page;
        this._mode  = mode || null;
    }

    public compose(): OutgoingPacket
    {
        this.packet
            .writeInt(this._page.id)
            .writeString(this._mode);

        this._page.parsePage(this.packet);

        const items = this._page.getItems();

        if(items)
        {
            const totalItems = items.length;

            if(totalItems)
            {
                this.packet.writeInt(totalItems);

                for(let i = 0; i < totalItems; i++) items[i].parseItem(this.packet);
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);

        this.packet.writeInt(0).writeBoolean(false);

        if(this._page.layout.name === CatalogLayouts.FRONTPAGE_FEATURED || this._page.layout.name === CatalogLayouts.FRONTPAGE) this.packet.writeInt(0);

        return this.packet.prepare();
    }
}