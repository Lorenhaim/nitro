import { Emulator } from '../../../../Emulator';
import { GroupForumInfoComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class GroupForumInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Emulator.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;

            if(!group.forumEnabled) return;

            this.client.processOutgoing(new GroupForumInfoComposer(group));
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