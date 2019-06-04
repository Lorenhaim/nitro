import { Incoming } from '../Incoming';

export class RoomLikeEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(currentRoom.securityManager.isStrictOwner(this.client.user)) return;

            return await this.client.user.inventory.rooms.likeRoom(currentRoom.id);
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