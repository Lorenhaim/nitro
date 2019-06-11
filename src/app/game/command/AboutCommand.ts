import { Nitro } from '../../Nitro';
import { GenericAlertComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class AboutCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'about');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(!user) return;
        
        user.connections.processOutgoing(new GenericAlertComposer(
            `<b>Nitro</b>\r` +
            `v0.0.1 by Billsonnn\r\r` +
            `<b>Statistics</b>\r` +
            `Ram Usage: ${ (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) } MB\r` +
            `Users Online: ${ Nitro.gameManager.userManager.users.length }\r` +
            `Rooms Loaded: ${ Nitro.gameManager.roomManager.rooms.length }\r\r` +
            `<b>Credits</b>\r` +
            `Quackster - Kepler\r` +
            `TheGeneral - Arcturus`));
    }

    public get description(): string
    {
        return 'Information about the server'
    }
}