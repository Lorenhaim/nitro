import { Room } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomInfoOwnerComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_INFO_OWNER);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(this._room.id).writeBoolean(this.client.user.unit.isOwner()).prepare();
    }
}