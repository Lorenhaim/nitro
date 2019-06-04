import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserFavoriteRoomComposer extends Outgoing
{
    private _roomId: number;
    private _status: boolean;

    constructor(roomId: number, status: boolean)
    {
        super(OutgoingHeader.USER_FAVORITE_ROOM);

        if(!roomId) return;

        this._roomId    = roomId;
        this._status    = status || false;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this._roomId)
            .writeBoolean(this._status)
            .prepare();
    }
}