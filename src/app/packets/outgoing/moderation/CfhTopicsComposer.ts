import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class CfhTopicsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.CFH_TOPICS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet
                .writeInt(1)
                .writeString('test')
                .writeInt(1)
                .writeString('test')
                .writeInt(1)
                .writeString('testt');
                
            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            this.error(err);
        }
    }
}