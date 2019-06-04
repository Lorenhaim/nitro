import { Emulator } from '../../../../Emulator';
import { ForumMode, Group } from '../../../../game';
import { GroupForumListComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class GroupForumListEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const mode      = this.packet.readInt();
            const offset    = this.packet.readInt();
            const amount    = this.packet.readInt();

            if(mode === ForumMode.MY_GROUPS)
            {
                const memberships = this.client.user.inventory.groups.memberships;

                if(!memberships) return;

                const totalMemberships = memberships.length;

                if(!totalMemberships) return;

                const results: Group[] = [];

                for(let i = 0; i < totalMemberships; i++)
                {
                    const membership = memberships[i];

                    if(!membership) continue;

                    const group = await Emulator.gameManager.groupManager.getGroup(membership.groupId);

                    if(!group) continue;

                    if(!group.forumEnabled) continue;

                    results.push(group);
                }

                if(!results.length) return;

                this.client.processOutgoing(new GroupForumListComposer(mode, offset, ...results));
            }
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