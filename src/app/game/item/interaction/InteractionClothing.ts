import { Nitro } from '../../../Nitro';
import { Unit } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { OnClick, OnRedeem } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionClothing extends InteractionDefault implements OnClick, OnRedeem
{
    constructor()
    {
        super('clothing');
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }

    public async onRedeem(user: User, item: Item): Promise<void>
    {
        if(!user || !item) return;

        if(!item.room) return;

        const clothingIds = Nitro.gameManager.catalogManager.getClothingIds(item.baseItem.productName);

        if(!clothingIds)
        {
            item.willRemove = true;

            return item.room.itemManager.removeItem(user, true, item);
        }

        await user.inventory.clothing.addClothing(...clothingIds);

        item.willRemove = true;

        item.room.itemManager.removeItem(user, true, item);
    }
}