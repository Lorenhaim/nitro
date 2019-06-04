import { Emulator } from '../../Emulator';
import { GenericAlertComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class HotelAlertCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'hotelalert', 'ha');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const message = parts[0];

        if(message) Emulator.gameManager.userManager.processOutgoing(new GenericAlertComposer(message + `\r\r- <b> ${ user.details.username }</b>`));
    }

    public get description(): string
    {
        return 'Sends an alert to everyone';
    }
}