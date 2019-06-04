import { CurrencyType, User } from '../../user';
import { Item } from '../Item';
import { OnRedeem } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionExchange extends InteractionDefault implements OnRedeem
{
    constructor()
    {
        super('exchange');
    }

    public async onRedeem(user: User, item: Item): Promise<void>
    {
        if(!user || !item) return;

        if(!item.room) return;

        const parts = item.baseItem.extraData.split(':');

        if(parts.length !== 2) return;
        
        const currencyType: CurrencyType    = parseInt(parts[0]);
        const amount: number                = parseInt(parts[1]);

        if(typeof currencyType === 'number' && typeof amount === 'number')
        {
            await user.inventory.currency.modifyCurrency(currencyType, amount);

            item.willRemove = true;

            item.room.itemManager.removeItem(user, item);
        }
    }
}