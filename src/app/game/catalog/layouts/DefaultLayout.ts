import { OutgoingPacket } from '../../../packets';
import { CatalogPage } from '../CatalogPage';
import { CatalogLayout } from './CatalogLayout';

export class DefaultLayout extends CatalogLayout
{
    constructor()
    {
        super('default_3x3');
    }

    public parsePage(page: CatalogPage, packet: OutgoingPacket): OutgoingPacket
    {
        if(page && packet)
        {
            return packet
                .writeString('default_3x3')
                .writeInt(3)
                .writeString(page.imageHeader, page.imageTeaser, page.imageSpecial)
                .writeInt(3)
                .writeString(page.textHeader, page.textDetails, page.textTeaser);
        }

        return null;
    }
}