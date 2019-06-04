import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class RoomDoorbellCloseComposer extends Outgoing
{
    private _username: string;

    constructor(username?: string)
    {
        super(OutgoingHeader.ROOM_DOORBELL_CLOSE);

        this._username = username || null;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeString(this._username).prepare();
    }
}