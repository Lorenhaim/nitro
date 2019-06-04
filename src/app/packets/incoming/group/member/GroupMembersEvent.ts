import { Emulator } from '../../../../Emulator';
import { GroupMembersComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class GroupMembersEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Emulator.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;

            const pageId    = this.packet.readInt();
            const search    = this.packet.readString();
            const listType  = this.packet.readInt();

            const members = await group.getMembers(pageId, search, listType === 1 ? true : false, listType === 2 ? true : false);

            this.client.processOutgoing(new GroupMembersComposer(group, pageId, search, listType, {
                members: members[0],
                totalResults: members[1]
            }));
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