import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class SecurtiyDebugComposer extends Outgoing
{
    private _status: boolean;

    constructor(status: boolean)
    {
        super(OutgoingHeader.SECURITY_DEBUG);

        this._status = status || false;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeBoolean(this._status).prepare();
    }
}