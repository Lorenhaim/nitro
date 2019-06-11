import { Nitro } from '../../../../Nitro';
import { Incoming } from '../../Incoming';

export class GroupAdminRemoveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Nitro.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;
            
            await group.removeAdmin(this.client.user, this.packet.readInt());
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