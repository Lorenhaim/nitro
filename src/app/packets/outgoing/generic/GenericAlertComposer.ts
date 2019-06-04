import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GenericAlertComposer extends Outgoing
{
    private _message: string;
    private _url: string;

    constructor(message: string, url?: string)
    {
        super(OutgoingHeader.GENERIC_ALERT);

        this._message   = message || null;
        this._url       = url || null;
    }

    public compose(): OutgoingPacket
    {
        if(!this._message) return this.cancel();
            
        this.packet.writeString(this._message);
        this.packet.writeString(this._url);

        return this.packet.prepare();
    }
}