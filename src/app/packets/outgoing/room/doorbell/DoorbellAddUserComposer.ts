import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class DoorbellAddUserComposer extends Outgoing
{
    private _username: string;

    constructor(username?: string)
    {
        super(OutgoingHeader.ROOM_DOORBELL_ADD);

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