import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ValidatorComposer extends Outgoing
{
    private _result: boolean;

    constructor(result: boolean)
    {
        super(OutgoingHeader.VALIDATOR);

        this._result = result || false;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeBoolean(this._result).prepare();
    }
}