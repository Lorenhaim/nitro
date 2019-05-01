import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CameraPriceComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.CAMERA_PRICE);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
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