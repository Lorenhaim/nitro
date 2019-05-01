import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class GiftConfigComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.GIFT_CONFIG);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeBoolean(true)
                .writeInt(2)
                .writeInt(0) // loop each gift wrap
                .writeInt(8, 0, 1, 2, 3, 4, 5, 6, 8, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
                .writeInt(0) // loop gifts
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}