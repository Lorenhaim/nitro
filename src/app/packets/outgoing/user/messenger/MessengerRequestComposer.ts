import { MessengerRequest } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRequestComposer extends Outgoing
{
    private _request: MessengerRequest;

    constructor(request: MessengerRequest)
    {
        super(OutgoingHeader.MESSENGER_REQUEST);

        this._request = request;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._request.id)
                .writeString(this._request.username, this._request.figure)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}