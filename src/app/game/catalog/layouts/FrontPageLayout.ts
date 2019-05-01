import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';
import { CatalogLayout } from './CatalogLayout';

export class FrontPageLayout extends CatalogLayout
{
    constructor()
    {
        super('frontpage4');
    }

    public parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket
    {
        if(page && packet)
        {
            return packet
                .writeString('frontpage4')
                .writeInt(2)
                .writeString(page.imageHeader, page.imageTeaser)
                .writeInt(3)
                .writeString(page.textHeader, page.textDetails, page.textTeaser);
        }

        return null;
    }
}