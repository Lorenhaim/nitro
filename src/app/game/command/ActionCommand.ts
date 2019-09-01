import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class ActionCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'a', 'action');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user || !user.unit) return;

        user.unit.location.action(parseInt(parts[0]));
    }

    public get usage(): string
    {
        return '< actionId? >';
    }

    public get description(): string
    {
        return 'Action';
    }
}