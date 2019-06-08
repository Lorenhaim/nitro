import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class GroupCreateOptionsComposer extends Outgoing
{
    private _rooms: { id: number, name: string }[]

    constructor(...rooms: { id: number, name: string }[])
    {
        super(OutgoingHeader.GROUP_CREATE_OPTIONS);

        this._rooms = [ ...rooms ];
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(1);

        const totalRooms = this._rooms.length;

        if(totalRooms)
        {
            this.packet.writeInt(totalRooms);

            for(let i = 0; i < totalRooms; i++)
            {
                const room = this._rooms[i];

                this.packet.writeInt(room.id).writeString(room.name).writeBoolean(false);
            }
        }
        else this.packet.writeInt(0);

        this.packet.writeInt(5)

        this.packet.writeInt(10, 3, 4);
        this.packet.writeInt(25, 17, 5);
        this.packet.writeInt(25, 17, 3);
        this.packet.writeInt(29, 11, 4);
        this.packet.writeInt(0, 0, 0);

        return this.packet.prepare();
    }
}