import { Emulator } from '../../../Emulator';
import { UserProfileComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class UserProfileEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = await Emulator.gameManager.userManager.getOfflineUserById(this.packet.readInt());

            if(!user) return;

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