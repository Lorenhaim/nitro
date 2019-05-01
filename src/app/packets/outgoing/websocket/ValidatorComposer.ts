import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ValidatorComposer extends Outgoing
{
    constructor(private readonly result: boolean)
    {
        super(OutgoingHeader.VALIDATOR);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeBoolean(this.result);

            this.packet.prepare();

            return this.packet;
        }

        catch(err)
        {
            this.error(err);
        }
    }
}