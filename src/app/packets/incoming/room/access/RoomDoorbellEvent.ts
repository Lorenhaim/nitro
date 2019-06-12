import { Nitro } from '../../../../Nitro';
import { Incoming } from '../../Incoming';

export class RoomDoorbellEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const username  = this.packet.readString();
            const accepted  = this.packet.readBoolean();

            if(!this.client.user.unit.hasRights()) return;

            const user = Nitro.gameManager.userManager.getUserByUsername(username);

            if(!user) return;

            if(user.unit.roomQueue !== currentRoom) return;

            if(!accepted) return user.unit.reset();
            else return await user.unit.enterRoomPartOne(currentRoom.id, null, true);
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