import { Incoming } from '../../Incoming';

export class RoomRightsRemoveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const userIds: number[] = [];

            const totalToRemove = this.packet.readInt();

            if(!totalToRemove) return;
            
            for(let i = 0; i < totalToRemove; i++) userIds.push(this.packet.readInt());

            if(!userIds.length) return;

            await currentRoom.securityManager.removeRights(this.client.user, ...userIds);
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