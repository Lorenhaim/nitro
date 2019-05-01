import { OutgoingPacket } from '../../';
import { Room } from '../../../../game';
import { Outgoing } from '../../Outgoing';
import { OutgoingHeader } from '../../OutgoingHeader';

export class RoomRightsListComposer extends Outgoing
{
    private _room: Room;

    constructor(room: Room)
    {
        super(OutgoingHeader.ROOM_RIGHTS_LIST);

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    public compose(): OutgoingPacket
    {
        try
        {
            this.packet.writeInt(this._room.id);

            const activeRights = this._room.securityManager.rights;

            if(activeRights)
            {
                const totalActiveRights = activeRights.length;

                if(totalActiveRights)
                {
                    this.packet.writeInt(totalActiveRights);

                    for(let i = 0; i < totalActiveRights; i++)
                    {
                        const right = activeRights[i];

                        this.packet.writeInt(right.id).writeString(right.username);
                    }

                    return this.packet.prepare();
                }
            }

            return this.packet.writeInt(0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}