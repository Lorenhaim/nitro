import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomModelBlockedTilesComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_MODEL_BLOCKED_TILES);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        const positions = this._room.map.getBlockedPositions();

        if(!positions) return this.packet.writeInt(0).prepare();

        const totalPositions = positions.length;

        if(!totalPositions) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalPositions);

        for(let i = 0; i < totalPositions; i++)
        {
            const position = positions[i];

            this.packet.writeInt(position.x, position.y)
        }

        return this.packet.prepare();
    }
}