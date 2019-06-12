import { Nitro } from '../../../../../Nitro';
import { UserBadgesCurrentComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class UserBadgesCurrentEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = await Nitro.gameManager.userManager.getOfflineUserById(this.packet.readInt());

            if(!user) return;

            await user.inventory.badges.init();
            
            this.client.processOutgoing(new UserBadgesCurrentComposer(user));
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