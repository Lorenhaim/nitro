import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class ShutdownCommand extends Command
{
    constructor()
    {
        super(PermissionList.SHUTDOWN_SERVER, 'shutdown');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        await Nitro.dispose();
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Shutdowns the emulator';
    }
}