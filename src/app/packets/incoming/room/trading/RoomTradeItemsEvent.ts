import { Item } from '../../../../game';
import { Incoming } from '../../Incoming';

export class RoomTradeItemsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const tradeUser = this.client.user.unit.tradeUser;

            if(!tradeUser) return;
            
            const totalItems = this.packet.readInt();

            if(!totalItems) return;

            const items: Item[] = [];

            for(let i = 0; i < totalItems; i++)
            {
                const item = this.client.user.inventory.items.getItem(this.packet.readInt());

                if(!item) continue;

                items.push(item);
            }

            if(!items.length) return;
            
            tradeUser.offerItems(...items);
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get authenticationRequired(): boolean
    {
        return true;
    }
}