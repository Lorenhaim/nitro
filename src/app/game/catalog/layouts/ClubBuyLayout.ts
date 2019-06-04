import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';
import { CatalogLayout } from './CatalogLayout';

export class ClubBuyLayout extends CatalogLayout
{
    constructor()
    {
        super('club_buy');
    }

    public parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket
    {
        if(!page || !packet) return null;
        
        return packet
            .writeString(this.name)
            .writeInt(2)
            .writeString(page.imageHeader, page.imageTeaser)
            .writeInt(0);
    }
}