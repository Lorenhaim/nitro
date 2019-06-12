import { Nitro } from '../../Nitro';
import { PermissionList } from '../security';
import { User } from '../user';
import { Command } from './Command';

export class UpdateCatalogCommand extends Command
{
    constructor()
    {
        super(PermissionList.UPDATE_CATALOG, 'update_catalog', 'uc');
    }

    public async process(user: User, parts: string[]): Promise<void>
    {
        await Nitro.gameManager.catalogManager.reload();

        Nitro.gameManager.catalogManager.notifyReload();
    }

    public get usage(): string
    {
        return '';
    }

    public get description(): string
    {
        return 'Reloads the catalog';
    }
}