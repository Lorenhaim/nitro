import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';
import { CatalogLayout } from './CatalogLayout';

export class FrontPageFeaturedLayout extends CatalogLayout
{
    constructor()
    {
        super('frontpage_featured');
    }

    public parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket
    {
        if(!page || !packet) return null;
        
        return packet
            .writeString(this.name)
            .writeInt(1)
            .writeString(page.imageHeader)
            .writeInt(3)
            .writeString(page.textHeader, page.textDetails, page.textTeaser);
    }
}