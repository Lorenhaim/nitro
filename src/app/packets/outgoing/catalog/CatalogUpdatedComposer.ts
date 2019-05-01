import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CatalogUpdatedComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.CATALOG_UPDATED);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeBoolean(false).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}