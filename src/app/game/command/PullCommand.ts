import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class PullCommand extends Command
{
    constructor()
    {
        super(PermissionList.PULL_UNIT, 'pull');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;
        
        const currentRoom = user.unit.room;

        if(!currentRoom) return;
        
        const unit = currentRoom.unitManager.getUnitByUsername(parts[0]);

        if(!unit) return;

        unit.location.walkToUnit(user.unit, false);
    }

    public get usage(): string
    {
        return `< username >`;
    }

    public get description(): string
    {
        return 'Pulls a user towards you';
    }
}