import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';
import { CatalogLayout } from './CatalogLayout';

export class SpacesNewLayout extends CatalogLayout
{
    constructor()
    {
        super('spaces_new');
    }

    public parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket
    {
        if(!page || !packet) return null;
        
        return packet
            .writeString(this.name)
            .writeInt(3)
            .writeString(page.imageHeader, page.imageTeaser, page.imageSpecial)
            .writeInt(3)
            .writeString(page.textHeader, page.textDetails, page.textTeaser);
    }
}