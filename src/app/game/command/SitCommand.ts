import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class SitCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'sit');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user && user.unit) user.unit.location.sit(true, parseInt(parts[0]), parseInt(parts[1]));
    }
}