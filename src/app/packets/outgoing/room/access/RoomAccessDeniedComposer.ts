import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomAccessDeniedComposer extends Outgoing
{
    private _username: string;

    constructor(username: string = null)
    {
        super(OutgoingHeader.ROOM_ACCESS_DENIED);

        this._username = username || null;

    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeString(this._username).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}