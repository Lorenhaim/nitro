import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class LayCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'lay');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        if(user && user.unit) user.unit.location.lay(true, null, parseInt(parts[0]));
    }
}