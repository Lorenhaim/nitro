import { Emulator } from '../../../Emulator';
import { User } from '../../user';
import { Item } from '../Item';
import { OnRedeem } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionClothing extends InteractionDefault implements OnRedeem
{
    constructor()
    {
        super('clothing');
    }

    public async onRedeem(user: User, item: Item): Promise<void>
    {
        if(!user || !item) return;

        if(!item.room) return;

        const clothingIds = Emulator.gameManager.catalogManager.getClothingIds(item.baseItem.productName);

        if(!clothingIds)
        {
            item.willRemove = true;

            return item.room.itemManager.removeItem(user, item);
        }

        await user.inventory.clothing.addClothing(...clothingIds);

        item.willRemove = true;

        item.room.itemManager.removeItem(user, item);
    }
}