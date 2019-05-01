import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RecyclerPrizesComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.RECYCLER_PRIZES);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}