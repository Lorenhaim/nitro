import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class BubbleAlertComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.BUBBLE_ALERT);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeString('furni_placement_error')
                .writeInt(3)
                .writeString('display')
                .writeString('BUBBLE')
                .writeString('TEST')
                .writeString('testing')
                .writeString('count')
                .writeString('1')
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}