import { MessengerChatError } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerChatErrorComposer extends Outgoing
{
    private _error: MessengerChatError;

    constructor(error: MessengerChatError)
    {
        super(OutgoingHeader.MESSENGER_CHAT_ERROR);

        if(error < 0) throw new Error('invalid_error');
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._error)
                .writeInt(this.client.user.id)
                .writeInt(this._error)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}