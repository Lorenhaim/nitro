import { UserDao } from '../../../database';
import { GroupCreateOptionsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class GroupCreateOptionsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const results = await UserDao.getOwnedRoomsWithoutGroups(this.client.user.id);
            
            return this.client.processOutgoing(new GroupCreateOptionsComposer(...results));
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