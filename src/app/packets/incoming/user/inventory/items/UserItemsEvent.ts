import { Item } from '../../../../../game';
import { UserItemsComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class UserItemsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const items = this.client.user.inventory.items.items;

            if(!items) return this.client.processOutgoing(new UserItemsComposer(0, 0, null));
            
            const totalItems = items.length;

            if(!totalItems) return this.client.processOutgoing(new UserItemsComposer(0, 0, null));
            
            let totalPages = Math.ceil(totalItems / 1000);

            if(totalPages === 0) totalPages = 1;

            let totalRead       = 0;
            let currentCount    = 0;
            let currentPage     = 0;
            let currentItems: Item[] = [];

            while(totalRead < totalItems)
            {
                if(currentCount === 0) currentPage++;

                currentItems.push(items[totalRead]);

                totalRead++;
                currentCount++;

                if(currentCount === 1000)
                {
                    this.client.processOutgoing(new UserItemsComposer(totalPages, currentPage, currentItems));

                    currentCount = 0;
                    currentItems = [];
                }
                
                else if(totalRead === totalItems)
                {
                    this.client.processOutgoing(new UserItemsComposer(totalPages, currentPage, currentItems));

                    currentCount = 0;
                    currentItems = [];
                }
            }
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