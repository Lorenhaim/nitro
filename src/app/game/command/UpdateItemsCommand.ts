import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class UpdateItemsCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'update_items');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        await Nitro.gameManager.itemManager.reload();
    }

    public get description(): string
    {
        return 'Reloads base items & interactions';
    }
}