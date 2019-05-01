import { RoomTile } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomStackHeightComposer extends Outgoing
{
    private _tiles: RoomTile[];

    constructor(...tiles: RoomTile[])
    {
        super(OutgoingHeader.ROOM_STACK_HEIGHT);

        if(!tiles) throw new Error('invalid_tiles');

        this._tiles = [ ...tiles ];
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this._tiles)
            {
                const totalTiles = this._tiles.length;

                if(totalTiles)
                {
                    this.packet.writeBytes(totalTiles);

                    for(let i = 0; i < totalTiles; i++)
                    {
                        const tile = this._tiles[i];

                        this.packet.writeBytes(tile.position.x, tile.position.y).writeShort(tile.getRelativeHeight());
                    }

                    return this.packet.prepare();
                }
            }
            
            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}