import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class UnitChatComposer extends Outgoing
{
    private _chat: any;

    constructor(chat: any)
    {
        super(OutgoingHeader.UNIT_CHAT);

        this._chat = chat;
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