import { UserItemsRefreshComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RefreshInventoryCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'ri', 'refreshinventory', 'refresh_inventory');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            await user.inventory.items.reload();
            user.connections.processOutgoing(new UserItemsRefreshComposer());
        }
    }
}