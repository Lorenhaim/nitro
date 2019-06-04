import { Emulator } from '../../../Emulator';
import { GroupSettingsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class GroupSettingsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Emulator.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;

            if(!group.isOwner(this.client.user)) return;

            this.client.processOutgoing(new GroupSettingsComposer(group));
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