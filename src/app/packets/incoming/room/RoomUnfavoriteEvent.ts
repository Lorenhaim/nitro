import { Incoming } from '../Incoming';

export class RoomUnfavoriteEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            return await this.client.user.inventory.rooms.unfavoriteRoom(this.packet.readInt());
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