import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MarketplaceConfigComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.MARKETPLACE_CONFIG);
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeBoolean(true)
            .writeInt(1)
            .writeInt(10)
            .writeInt(5)
            .writeInt(1)
            .writeInt(1000000)
            .writeInt(48)
            .writeInt(7)
            .prepare();
    }
}