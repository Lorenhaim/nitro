import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GenericAlertMessagesComposer extends Outgoing
{
    private _messages: string[];

    constructor(...messages: string[])
    {
        super(OutgoingHeader.GENERIC_ALERT_MESSAGES);

        if(!messages) throw new Error('invalid_message');

        this._messages = [ ...messages ];
    }

    public compose(): OutgoingPacket
    {
        const totalMessages = this._messages.length;

        if(!totalMessages) return this.cancel();

        this.packet.writeInt(totalMessages);

        for(let i = 0; i < totalMessages; i++) this.packet.writeString(this._messages[i]);

        return this.packet.prepare();
    }
}