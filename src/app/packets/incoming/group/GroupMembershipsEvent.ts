import { GroupListComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class GroupMembershipsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const groups = this.client.user.inventory.groups.getGroups();
            
            return this.client.processOutgoing(new GroupListComposer(...groups));
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