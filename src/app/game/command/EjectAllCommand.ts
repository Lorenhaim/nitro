import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class EjectAllCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'ejectall', 'eject_all', 'ea');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        const items = currentRoom.itemManager.getItemsByUser(user);

        if(!items || !items.length) return;

        currentRoom.itemManager.removeItem(user, false, ...items);
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Ejects all owned furniture from the room';
    }
}