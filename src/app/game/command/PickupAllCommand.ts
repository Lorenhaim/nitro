import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class PickupAllCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'pickup_all', 'pickall', 'pa');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;

        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        if(!user.unit.isOwner()) return;

        currentRoom.itemManager.removeItem(user, false, ...currentRoom.itemManager.items);
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Pickups all items in the room';
    }
}