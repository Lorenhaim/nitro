import { Emulator } from '../../../../Emulator';
import { Incoming } from '../../Incoming';

export class GroupRequestEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Emulator.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;

            await group.requestMembership(this.client.user);
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