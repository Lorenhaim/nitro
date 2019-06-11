import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class GiveBadgeCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'gb', 'givebadge');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            const username  = parts[0];
            const badgeCode    = parts[1];

            if(username && badgeCode)
            {
                const onlineUser = Nitro.gameManager.userManager.getUserByUsername(username);

                if(onlineUser) await onlineUser.inventory.badges.giveBadge(badgeCode);
            }
        }
    }

    public get description(): string
    {
        return 'Give badges';
    }
}