import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';
import { CatalogLayout } from './CatalogLayout';

export class GroupFrontpageLayout extends CatalogLayout
{
    constructor()
    {
        super('guild_frontpage');
    }

    public parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket
    {
        if(!page || !packet) return null;
        
        return packet
            .writeString(this.name)
            .writeInt(2)
            .writeString(page.imageHeader, page.imageTeaser)
            .writeInt(3)
            .writeString(page.textHeader, page.textDetails, page.textTeaser);
    }
}