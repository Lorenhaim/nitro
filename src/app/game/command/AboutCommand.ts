import { Emulator } from '../../Emulator';
import { GenericAlertComposer } from '../../packets';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class AboutCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'Information about the emulator', null, 'about', 'info', 'server');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            user.connections.processOutgoing(new GenericAlertComposer(
                `<b>HabboAPI Emulator</b> v0.0.1\r` +
                `by <b>Billsonnn</b>\r\r` +
                `<b>Statistics</b>\r` +
                `Users Online:&nbsp;${ Emulator.gameManager.userManager.users.length }\r` +
                `Rooms Loaded:&nbsp;${ Emulator.gameManager.roomManager.rooms.length }\r\r` +
                `Credits\r` +
                `Quackster - Kepler\r` +
                `TheGeneral - Arcturus`));
        }
    }
}