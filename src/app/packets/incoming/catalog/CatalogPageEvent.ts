import { Emulator } from '../../../Emulator';
import { CatalogPageComposer } from '../../outgoing/catalog/CatalogPageComposer';
import { Incoming } from '../Incoming';

export class CatalogPageEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const pageId    = this.packet.readInt();
            const unknown   = this.packet.readInt();
            const mode      = this.packet.readString();

            const page = Emulator.gameManager.catalogManager.getPage(pageId, this.client.user.details.rankId);

            if(!page) return;

            this.client.processOutgoing(new CatalogPageComposer(page, mode));
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