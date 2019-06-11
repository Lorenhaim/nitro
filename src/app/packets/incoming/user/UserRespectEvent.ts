import { Nitro } from '../../../Nitro';
import { Incoming } from '../Incoming';

export class UserRespectEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const user = Nitro.gameManager.userManager.getUserById(this.packet.readInt());

            if(!user) return;

            this.client.user.unit.location.lookAtPosition(user.unit.location.position);

            this.client.user.details.giveRespect(user);
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