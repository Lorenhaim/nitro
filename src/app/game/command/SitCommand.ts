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
        if(!user || !user.unit) return;

        const height    = !parts[0] ? 0.50 : parseInt(parts[0]);
        const direction = !parts[1] ? null : parseInt(parts[1]);
        
        user.unit.location.sit(true, height, direction);
    }

    public get usage(): string
    {
        return '< height? > < direction? >';
    }

    public get description(): string
    {
        return 'Toggle sitting at your current location';
    }
}