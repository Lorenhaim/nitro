import { Nitro } from '../../../../Nitro';
import { GroupForumThreadsComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class GroupForumThreadsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Nitro.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;

            if(!group.forumEnabled) return;

            const index = this.packet.readInt();

            const threads = await group.forum.getThreads(0);

            this.client.processOutgoing(new GroupForumThreadsComposer(group, index, ...threads[0]));
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