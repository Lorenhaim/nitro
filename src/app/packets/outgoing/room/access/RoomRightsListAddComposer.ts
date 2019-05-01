import { OutgoingPacket } from '../../';
import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';

export class RoomRightsListAddComposer extends Outgoing
{
    private _room: Room;
    private _right: { id: number, username: string };

    constructor(room: Room, right: { id: number, username: string })
    {
        super(OutgoingHeader.ROOM_RIGHTS_LIST_ADD);

        if(!(room instanceof Room) || !right) throw new Error('invalid_room');

        this._room  = room;
        this._right = right;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._room.id, this._right.id).writeString(this._right.username).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}