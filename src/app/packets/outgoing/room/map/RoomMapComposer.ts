import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomMapComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_MAP);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const map = this._room.map;

            if(!map) return this.cancel();
            
            const tiles = map.tiles;

            if(!tiles) return this.cancel();

            const totalTiles = tiles.length;

            if(!totalTiles) return this.cancel();
            
            this.packet
                .writeInt(this._room.model.totalSize / this._room.model.totalY)
                .writeInt(this._room.model.totalSize);

            for(let i = 0; i < totalTiles; i++)
            {
                const tile = tiles[i];

                if(!tile) this.packet.writeShort(32767);
                else this.packet.writeShort(tile.getRelativeHeight());
            }

            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}