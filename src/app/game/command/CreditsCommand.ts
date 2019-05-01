import { Emulator } from '../../Emulator';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class CreditsCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'credits');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            const username  = parts[0];
            const amount    = parts[1];

            if(username && amount)
            {
                const onlineUser = Emulator.gameManager.userManager.getUserByUsername(username);

                if(onlineUser) await onlineUser.inventory.currencies.modifyCurrency(-1, <any> amount);
            }
        }
    }
}