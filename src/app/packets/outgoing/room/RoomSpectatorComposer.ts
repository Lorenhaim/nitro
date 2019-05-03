import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomSpectatorComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.ROOM_SPECTATOR);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}