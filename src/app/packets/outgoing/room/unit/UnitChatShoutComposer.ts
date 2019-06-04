import { ChatBubble, UnitEmotion } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitChatShoutComposer extends Outgoing
{
    private _chat: any;

    constructor(chat: any)
    {
        super(OutgoingHeader.UNIT_CHAT_SHOUT);

        this._chat =  {
            unit: chat.unit || null,
            message: chat.message || null,
            emotion: chat.emotion || UnitEmotion.NORMAL,
            bubble: chat.bubble || ChatBubble.NORMAL
        };
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this._chat.unit.id)
            .writeString(this._chat.message)
            .writeInt(this._chat.emotion)
            .writeInt(this._chat.bubble)
            .writeInt(0)
            .writeInt(this._chat.message.length)
            .prepare();
    }
}