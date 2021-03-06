import { Room } from '../../../../../game';
import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class RoomRightsListRemoveComposer extends Outgoing
{
    private _room: Room;
    private _userId: number;

    constructor(room: Room, userId: number)
    {
        super(OutgoingHeader.ROOM_RIGHTS_LIST_REMOVE);

        if(!(room instanceof Room) || !userId) throw new Error('invalid_room');

        this._room      = room;
        this._userId    = userId;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._room.id, this._userId).prepare();
    }
}