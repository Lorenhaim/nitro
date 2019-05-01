import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class DiscountConfigComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.DISCOUNT_CONFIG);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(100, 6, 1, 1, 2, 40, 99)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}