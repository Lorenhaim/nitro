import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ClothingOutfitsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_OUTFITS);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            if(this.client.user.inventory.outfits !== null && this.client.user.inventory.outfits.isLoaded)
            {
                const outfits = this.client.user.inventory.outfits.outfits;

                if(outfits !== null)
                {
                    const totalOutfits = outfits.length;

                    if(totalOutfits > 0)
                    {
                        this.packet.writeInt(1, totalOutfits);

                        for(let i = 0; i < totalOutfits; i++)
                        {
                            const outfit = outfits[i];

                            this.packet.writeInt(outfit.slotNumber).writeString(outfit.figure, outfit.gender.toUpperCase());
                        }

                        return this.packet.prepare();
                    }
                }
            }

            return this.packet.writeInt(1, 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}