import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class WiredSaveComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.WIRED_SAVE);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.prepare();
    }
}