import { Emulator } from '../../Emulator';
import { CatalogModeComposer, CatalogUpdatedComposer, DiscountConfigComposer, GiftConfigComposer, MarketplaceConfigComposer, RecyclerPrizesComposer } from '../../packets';
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

        Emulator.gameManager.userManager.processOutgoing(
            new CatalogUpdatedComposer(),
            new CatalogModeComposer(0),
            new DiscountConfigComposer(),
            new MarketplaceConfigComposer(),
            new GiftConfigComposer(),
            new RecyclerPrizesComposer());
    }
}