import { Nitro } from '../../../../Nitro';
import { Incoming } from '../../Incoming';

export class GroupRequestEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Nitro.gameManager.groupManager.getGroup(this.packet.readInt());

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