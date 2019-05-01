import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';
import { OutgoingPacket } from '../../OutgoingPacket';

export class RoomModelNameComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_MODEL_NAME);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this._room && this._room.model)
            {
                this.packet.writeString(this._room.model.name);
                this.packet.writeInt(this._room.id);
                    
                this.packet.prepare();

                return this.packet;
            }
            
            return this.cancel();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}