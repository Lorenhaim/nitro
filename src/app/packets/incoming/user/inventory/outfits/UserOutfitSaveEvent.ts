import { Incoming } from '../../../Incoming';

export class UserOutfitSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            await this.client.user.inventory.outfits.addOutfit(this.packet.readInt(), this.packet.readString(), <any> this.packet.readString());
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