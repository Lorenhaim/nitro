import { Nitro } from '../../../Nitro';
import { UserProfileComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserProfileEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = await Nitro.gameManager.userManager.getOfflineUserById(this.packet.readInt());

            if(!user) return;

            await user.inventory.badges.init();
            await user.inventory.groups.init();

            this.client.processOutgoing(new UserProfileComposer(user));
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