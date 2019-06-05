import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class ClientLatencyComposer extends Outgoing
{
    private _response: number;

    constructor(response: number)
    {
        super(OutgoingHeader.CLIENT_LATENCY);

        this._response = response || 0;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._response).prepare();
    }
}