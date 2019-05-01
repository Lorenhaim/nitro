import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ClientPongComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.CLIENT_PONG);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this.client.pingCount || 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}