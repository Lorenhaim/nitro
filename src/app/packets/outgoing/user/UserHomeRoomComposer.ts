import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserHomeRoomComposer extends Outgoing
{
    private _update: boolean;
    
    constructor(update: boolean = false)
    {
        super(OutgoingHeader.USER_HOME_ROOM);

        this._update = update || false;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this.client.user.details.homeRoom, this._update ? this.client.user.details.homeRoom : 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}