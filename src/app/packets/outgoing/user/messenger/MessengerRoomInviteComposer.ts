import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class MessengerRoomInviteComposer extends Outgoing
{
    private _userId: number;
    private _message: string;

    constructor(userId: number, message: string)
    {
        super(OutgoingHeader.MESSENGER_ROOM_INVITE);

        if(!userId || !message) throw new Error('invalid_invite');

        this._userId    = userId;
        this._message   = message;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet
                .writeInt(this._userId)
                .writeString(this._message)
                .prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}