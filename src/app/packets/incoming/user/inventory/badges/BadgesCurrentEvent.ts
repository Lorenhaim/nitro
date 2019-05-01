import { Emulator } from '../../../../../Emulator';
import { BadgesCurrentComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class BadgesCurrentEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = Emulator.gameManager.userManager.getUserById(this.packet.readInt());

            if(user) this.client.processOutgoing(new BadgesCurrentComposer(user.id, ...user.inventory.badges.currentBadges));
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