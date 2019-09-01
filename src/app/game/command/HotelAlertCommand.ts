import { Nitro } from '../../Nitro';
import { GenericAlertComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class HotelAlertCommand extends Command
{
    constructor()
    {
        super(PermissionList.ALL_PERMISSIONS, 'hotel_alert', 'ha');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const message = parts.join(' ');

        if(!message) return;
        
        Nitro.gameManager.userManager.processOutgoing(new GenericAlertComposer(message + `\r\r- <b> ${ user.details.username }</b>`));
    }

    public get usage(): string
    {
        return `< message >`;
    }

    public get description(): string
    {
        return 'Sends an alert to everyone';
    }
}