import { CatalogModeComposer, CatalogPagesComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class CatalogModeEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const mode = this.packet.readString();

            this.client.processOutgoing(
                new CatalogModeComposer(mode === 'NORMAL' ? 0 : 1),
                new CatalogPagesComposer(mode)
            );
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