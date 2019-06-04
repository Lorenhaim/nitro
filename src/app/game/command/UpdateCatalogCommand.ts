import { Emulator } from '../../Emulator';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class UpdateCatalogCommand extends Command
{
    constructor()
    {
        super(PermissionList.NONE, 'update_catalog');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        await Emulator.gameManager.catalogManager.reload();

        Emulator.gameManager.catalogManager.notifyReload();
    }

    public get description(): string
    {
        return 'Reloads the catalog';
    }
}