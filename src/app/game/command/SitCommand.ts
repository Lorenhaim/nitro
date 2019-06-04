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
        const height    = parts[0] || 0;
        const direction = parts[1] || 0;

        if(user && user.unit) user.unit.location.sit(true, parseInt(<any> height), parseInt(<any> direction));
    }

    public get description(): string
    {
        return 'Sit';
    }
}