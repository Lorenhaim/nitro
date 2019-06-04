import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserFowardRoomComposer extends Outgoing
{
    private _roomId: number;

    constructor(roomId: number)
    {
        super(OutgoingHeader.USER_FOWARD_ROOM);

        if(!roomId) throw new Error('invalid_room');

        this._roomId = roomId;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._roomId).prepare();
    }
}