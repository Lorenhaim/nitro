import { Emulator } from '../../Emulator';
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
        await Emulator.gameManager.itemManager.reload();
    }
}