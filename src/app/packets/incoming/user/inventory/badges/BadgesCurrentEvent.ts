import { Nitro } from '../../../../../Nitro';
import { UserBadgesCurrentComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class BadgesCurrentEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = await Nitro.gameManager.userManager.getOfflineUserById(this.packet.readInt());

            if(!user) return;

            await user.inventory.init();
            
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