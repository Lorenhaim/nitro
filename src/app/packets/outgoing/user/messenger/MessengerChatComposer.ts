import { TimeHelper } from '../../../../common';
import { MessengerChat } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerChatComposer extends Outgoing
{
    private _message: MessengerChat;

    constructor(message: MessengerChat)
    {
        super(OutgoingHeader.MESSENGER_CHAT);

        this._message = {
            userId: message.userId || 0,
            message: message.message || null,
            timestamp: message.timestamp || TimeHelper.now
        };

        if(this._message.userId < 0 || this._message.message === null) throw new Error('invalid_message');
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._message.userId)
                .writeString(this._message.message)
                .writeInt(TimeHelper.between(this._message.timestamp, TimeHelper.now, 'seconds'))
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}