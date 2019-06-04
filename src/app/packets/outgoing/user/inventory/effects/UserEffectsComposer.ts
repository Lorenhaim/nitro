import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserEffectsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_EFFECTS);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(0).prepare();
    }
}