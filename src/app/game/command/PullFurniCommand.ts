import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class PullFurniCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'pf', 'pull_furni');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;
        
        const currentRoom = user.unit.room;

        if(!currentRoom) return;

        const itemId = parseInt(parts[0]);

        if(!itemId) return;

        const item = currentRoom.itemManager.getItem(itemId);

        if(!item) return;

        const position = user.unit.location.position.getPositionInfront();

        if(!position) return;

        currentRoom.itemManager.moveItem(user, item, position, true);
    }

    public get usage(): string
    {
        return `< itemId >`;
    }

    public get description(): string
    {
        return 'Pulls a furni towards you';
    }
}