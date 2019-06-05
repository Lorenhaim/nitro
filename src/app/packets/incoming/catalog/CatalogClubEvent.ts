import { CatalogClubComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class CatalogClubEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            return this.client.processOutgoing(new CatalogClubComposer(this.packet.readInt()));
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