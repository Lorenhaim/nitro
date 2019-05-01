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
        try
        {
            if(this._message)
            {
                this.packet.writeString(this._message);
                this.packet.writeString(this._url);

                this.packet.prepare();

                return this.packet;
            }

            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}