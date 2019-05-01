import { GameClient } from '../../../networking';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurityMachineComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.SECURITY_MACHINE);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this.client instanceof GameClient) return this.packet.writeString(this.client.machineId || null).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}