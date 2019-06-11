import { Nitro } from '../../Nitro';
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
        if(!user) return;

        if(parts.length !== 2) return;

        const activeUser = Nitro.gameManager.userManager.getUserByUsername(parts[0]);

        if(!activeUser) return;
        
        await activeUser.inventory.currency.modifyCurrency(-1, parseInt(parts[1]));

        user.unit.chatSelf(`${ activeUser.details.username } has received ${ parts[1] } credits!`);

        activeUser.unit.chatSelf(`You have received ${ parts[1] } credits!`);
    }

    public get description(): string
    {
        return 'Gives credits';
    }
}