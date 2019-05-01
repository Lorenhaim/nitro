import { Emulator } from '../../../Emulator';
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

            const catalogItem = Emulator.gameManager.catalogManager.getItem(itemId);

            if(catalogItem) await catalogItem.purchaseItem(this.client.user.id, amount, extraData);
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