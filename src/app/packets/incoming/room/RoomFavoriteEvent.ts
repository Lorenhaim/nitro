import { Incoming } from '../Incoming';

export class RoomFavoriteEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            return await this.client.user.inventory.rooms.favoriteRoom(this.packet.readInt());
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}