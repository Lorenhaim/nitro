import { Emulator } from '../../Emulator';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RebootCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'reboot');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            await Emulator.reboot();
        }
    }

    public get description(): string
    {
        return 'Reboots the Emulator';
    }
}