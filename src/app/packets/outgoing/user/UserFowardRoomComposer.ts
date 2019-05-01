import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserFowardRoomComposer extends Outgoing
{
    private _roomId: number;

    constructor(roomId: number)
    {
        super(OutgoingHeader.USER_FOWARD_ROOM);

        if(roomId > 0)
        {
            this._roomId = roomId;
        }
        else
        {
            throw new Error('invalid_room_id');
        }
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._roomId).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }

    protected au
}