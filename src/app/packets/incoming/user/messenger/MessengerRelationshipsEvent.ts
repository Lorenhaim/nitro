import { Emulator } from '../../../../Emulator';
import { MessengerRelationshipsComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerRelationshipsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = await Emulator.gameManager.userManager.getOfflineUserById(this.packet.readInt());

            if(!user) return;

            await user.messenger.loadRelationships();

            this.client.processOutgoing(new MessengerRelationshipsComposer(user));
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