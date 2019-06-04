import { Room } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomScoreComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_SCORE);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        return this.packet
            .writeInt(this._room.details.totalLikes)
            .writeBoolean(!this.client.user.inventory.rooms.hasLiked(this._room.id) && !this._room.securityManager.isStrictOwner(this.client.user))
            .prepare();
    }
}