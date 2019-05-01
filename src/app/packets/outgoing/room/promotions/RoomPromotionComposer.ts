import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomPromotionComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.ROOM_PROMOTION);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(-1)
                .writeInt(-1)
                .writeString(null)
                .writeInt(0)
                .writeInt(0)
                .writeString(null)
                .writeString(null)
                .writeInt(0)
                .writeInt(0)
                .writeInt(0)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}