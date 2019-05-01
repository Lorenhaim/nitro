import { MessengerRequestError } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRequestErrorComposer extends Outgoing
{
    private _error: MessengerRequestError;

    constructor(error: MessengerRequestError)
    {
        super(OutgoingHeader.MESSENGER_REQUEST_ERROR);

        this._error = error;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(0).writeInt(this._error).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}