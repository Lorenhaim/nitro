import { Emulator } from '../../../../Emulator';
import { Incoming } from '../../Incoming';

export class UnitGiveHandItemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const user = Emulator.gameManager.userManager.getUserById(this.packet.readInt());

            if(!user) return;

            this.client.user.unit.location.walkToUnit(user.unit);
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