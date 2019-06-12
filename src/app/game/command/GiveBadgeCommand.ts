import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class GiveBadgeCommand extends Command
{
    constructor()
    {
        super(PermissionList.GIVE_BADGE, 'give_badge', 'gb');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;

        if(!user.hasPermission(PermissionList.GIVE_BADGE)) return;

        const exisitingUser = await Nitro.gameManager.userManager.getOfflineUserByUsername(parts[0]);

        parts.splice(0, 1);

        if(!exisitingUser) return;
        
        await exisitingUser.inventory.badges.giveBadge(...parts);
    }

    public get usage(): string
    {
        return `< username > < badgeCode[] >`;
    }

    public get description(): string
    {
        return 'Give badges';
    }
}