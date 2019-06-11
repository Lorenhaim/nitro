import { Nitro } from '../../../Nitro';
import { Incoming } from '../Incoming';

export class CatalogPurchaseEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const pageId    = this.packet.readInt();
            const itemId    = this.packet.readInt();
            const extraData = this.packet.readString();
            const amount    = this.packet.readInt();

            const catalogItem = Nitro.gameManager.catalogManager.getItem(itemId);

            if(!catalogItem) return;

            await catalogItem.purchaseItem(this.client.user, amount, extraData);
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