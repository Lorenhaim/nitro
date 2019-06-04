import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogSoldOutComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.CATALOG_SOLD_OUT);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}