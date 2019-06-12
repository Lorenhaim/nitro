import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class RebootCommand extends Command
{
    constructor()
    {
        super(PermissionList.REBOOT_SERVER, 'reboot');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        await Nitro.reboot();
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Reboots the Emulator';
    }
}