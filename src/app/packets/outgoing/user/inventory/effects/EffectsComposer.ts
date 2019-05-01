import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class EffectsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_EFFECTS);
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