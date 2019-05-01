import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class RoomCreatedComposer extends Outgoing
{
    private _id: number;
    private _name: string;

    constructor(id: number, name: string)
    {
        super(OutgoingHeader.ROOM_CREATED);

        if(id > 0 && name !== null)
        {
            this._id    = id;
            this._name  = name;
        }
        else
        {
            throw new Error('invalid_room');
        }
    }

    public compose(): OutgoingPacket
    {
        try
        {
            return this.packet.writeInt(this._id).writeString(this._name).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}