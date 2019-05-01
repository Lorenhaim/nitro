import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class EjectAllCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'ea', 'ejectall');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        const items = currentRoom.itemManager.getUserItems(user.id);

        if(!items || !items.length) return;

        currentRoom.itemManager.removeItem(user, ...items);
    }
}