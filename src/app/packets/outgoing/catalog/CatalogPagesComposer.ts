import { CatalogPage } from '../../../game';
import { Nitro } from '../../../Nitro';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogPagesComposer extends Outgoing
{
    private _mode: string;

    constructor(mode: string)
    {
        super(OutgoingHeader.CATALOG_PAGES);

        this._mode = mode || null;
    }

    public compose(): OutgoingPacket
    {
        this.packet
            .writeBoolean(true)
            .writeInt(0, -1)
            .writeString('root', '')
            .writeInt(0);
        
        const pages = Nitro.gameManager.catalogManager.getPages(0, this.client.user.details.rankId);

        if(pages)
        {
            const totalPages = pages.length;

            if(totalPages)
            {
                this.packet.writeInt(totalPages);
                
                for(let i = 0; i < totalPages; i++) this.parsePage(pages[i]);
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);

        return this.packet.writeBoolean(false).writeString('NORMAL').prepare();
    }

    private parsePage(page: CatalogPage): void
    {
        if(!page) return;
        
        this.packet
            .writeBoolean(page.isVisible) // visible
            .writeInt(page.iconImage) // icon image
            .writeInt(page.isVisible ? page.id : -1) // if enabled id, else -1
            .writeString(page.caption)
            .writeString(page.name);

        const offerIds = page.offerIds;

        if(offerIds)
        {
            const totalOfferIds = offerIds.length;

            if(totalOfferIds)
            {
                this.packet.writeInt(totalOfferIds);

                for(let i = 0; i < totalOfferIds; i++) this.packet.writeInt(offerIds[i]);
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);

        const children = Nitro.gameManager.catalogManager.getPages(page.id, this.client.user.details.rankId);

        if(children)
        {
            const totalChildren = children.length;

            if(totalChildren)
            {
                this.packet.writeInt(totalChildren);
                
                for(let i = 0; i < totalChildren; i++) this.parsePage(children[i]);
            }
            else this.packet.writeInt(0);
        }
        else this.packet.writeInt(0);
    }
}