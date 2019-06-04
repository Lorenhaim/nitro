import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserFavoriteRoomCountComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_FAVORITE_ROOM_COUNT);
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(100); // allowed count

        const totalFavoriteRooms = this.client.user.inventory.rooms.favoritedRoomIds.length;

        if(!totalFavoriteRooms) return this.packet.writeInt(0).prepare();

        this.packet.writeInt(totalFavoriteRooms);

        for(let i = 0; i < totalFavoriteRooms; i++) this.packet.writeInt(this.client.user.inventory.rooms.favoritedRoomIds[i]);

        return this.packet.prepare();
    }
}