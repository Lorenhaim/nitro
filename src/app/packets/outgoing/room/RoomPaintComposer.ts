import { Room, RoomPaintType } from '../../../game';
import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomPaintComposer extends Outgoing
{
    private _room: Room;
    private _type: RoomPaintType;

    constructor(room: Room, type: RoomPaintType)
    {
        super(OutgoingHeader.ROOM_PAINT);

        if(!(room instanceof Room) || !type) throw new Error('invalid_room');

        this._room  = room;
        this._type  = type;
    }

    public compose(): OutgoingPacket
    {
        if(this._type === RoomPaintType.FLOOR)
        {
            const paintFloor = this._room.details.paintFloor;

            if(!paintFloor) return this.cancel();
            
            return this.packet.writeString(RoomPaintType.FLOOR, this._room.details.paintFloor.toString()).prepare();
        }

        else if(this._type === RoomPaintType.WALLPAPER)
        {
            const paintWall = this._room.details.paintWall;

            if(!paintWall) return this.cancel();
            
            return this.packet.writeString(RoomPaintType.WALLPAPER, this._room.details.paintWall.toString()).prepare();
        }

        else if(this._type === RoomPaintType.LANDSCAPE)
        {
            const paintLandscape = this._room.details.paintLandscape;

            if(!paintLandscape) return this.cancel();
            
            return this.packet.writeString(RoomPaintType.LANDSCAPE, this._room.details.paintLandscape.toString()).prepare();
        }

        else return this.cancel();
    }
}