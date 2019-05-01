import { InteractionType, Item } from '../../item';
import { PickupItemEvent } from '../../room';
import { CurrencyType } from '../inventory';
import { UserEvent } from './UserEvent';

export class RedeemItemEvent extends UserEvent
{
    private _items: Item[] = [];

    constructor(...items: Item[])
    {
        super();

        if(!items) throw new Error('invalid_items');

        this._items = [ ...items ];
    }

    public async runEvent(): Promise<void>
    {
        const totalItems = this._items.length;

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const item = this._items[i];

                if(item.userId === this.user.id)
                {
                    if(item.baseItem.hasInteraction(InteractionType.EXCHANGE))
                    {
                        if(item.baseItem.extraData)
                        {
                            const parts = item.baseItem.extraData.split(':');

                            if(parts.length === 2)
                            {
                                const currencyType: CurrencyType    = parseInt(parts[0]);
                                const amount: number                = parseInt(parts[1]);

                                if(typeof currencyType === 'number' && typeof amount === 'number')
                                {
                                    await this.user.inventory.currencies.modifyCurrency(currencyType, amount);

                                    item.room.events.next(new PickupItemEvent(this.user, item.id, true));
                                    // remove the item from the room & clear the user

                                    item.clearUser();

                                    item.save();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}