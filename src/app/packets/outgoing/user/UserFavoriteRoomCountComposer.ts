import { Outgoing } from '../Outgoing';
import { OutgoingHeader } from '../OutgoingHeader';
import { OutgoingPacket } from '../OutgoingPacket';

export class UserFavoriteRoomCountComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_FAVORITE_ROOM_COUNT);
    }

    public compose(): OutgoingPacket
    {
        return this.packet.writeInt(1, 0).prepare();
    }
}