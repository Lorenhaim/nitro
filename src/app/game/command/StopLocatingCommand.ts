import { Emulator } from '../../Emulator';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class StopLocatingCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'sl', 'stoplocating', 'disablewalk');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            const username  = parts[0];
            const status    = parts[1];

            if(username && status !== undefined || status !== null)
            {
                const onlineUser = Emulator.gameManager.userManager.getUserByUsername(username);

                if(onlineUser && onlineUser.unit)
                {
                    onlineUser.unit.canLocate = status === '1' || status === 'yes' ? true : false;
                }
            }
        }
    }
}