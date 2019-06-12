import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class ToggleLocationCommand extends Command
{
    constructor()
    {
        super(PermissionList.TOGGLE_LOCATION, 'toggle_location', 'tl');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        const activeUser = Nitro.gameManager.userManager.getUserByUsername(parts[0]);

        if(!activeUser) return;

        activeUser.unit.canLocate = !activeUser.unit.canLocate;
    }

    public get usage(): string
    {
        return `< username >`;
    }

    public get description(): string
    {
        return 'Toggles the users ability to interact with the room map';
    }
}