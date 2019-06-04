import { Emulator } from '../../Emulator';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class ToggleLocatingCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'sl');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const activeUser = Emulator.gameManager.userManager.getUserByUsername(parts[0]);

        if(!activeUser) return;

        activeUser.unit.canLocate = !activeUser.unit.canLocate;
    }

    public get description(): string
    {
        return 'Toggle location for the specified user';
    }
}