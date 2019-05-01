import { ClothingOutfitsComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class OutfitsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.inventory.outfits && this.client.user.inventory.outfits.isLoaded) this.client.processOutgoing(new ClothingOutfitsComposer());
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