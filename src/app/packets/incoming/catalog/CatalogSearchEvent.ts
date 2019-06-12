import { Nitro } from '../../../Nitro';
import { CatalogSearchComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class CatalogSearchEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const catalogItem = Nitro.gameManager.catalogManager.getItemByOfferId(this.packet.readInt());

            if(!catalogItem) return;

            return this.client.processOutgoing(new CatalogSearchComposer(catalogItem));
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