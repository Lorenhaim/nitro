import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class ShutdownCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'shutdown');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user)
        {
            await Nitro.dispose();
        }
    }

    public get description(): string
    {
        return 'Shutdowns the emulator';
    }
}