import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class DanceCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'd', 'dance');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;

        user.unit.location.dance(parseInt(parts[0]));
    }

    public get usage(): string
    {
        return '< danceId? >';
    }

    public get description(): string
    {
        return 'Dance';
    }
}