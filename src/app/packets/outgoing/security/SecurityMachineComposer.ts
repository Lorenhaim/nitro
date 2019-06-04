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
        if(this.client instanceof GameClient) return this.packet.writeString(this.client.machineId || null).prepare();
        else return this.cancel();
    }
}