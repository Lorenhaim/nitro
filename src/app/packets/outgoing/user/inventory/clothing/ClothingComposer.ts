import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class ClothingComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CLOTHING);
    }

    public compose(): OutgoingPacket
    {
        try
        {
            const outfits = this.client.user.inventory.outfits.outfits;
            
            if(outfits)
            {
                const totalOutfits = outfits.length;

                if(totalOutfits)
                {
                    const ids: number[]     = [];
                    const figures: string[] = [];

                    for(let i = 0; i < totalOutfits; i++)
                    {
                        const outfit = outfits[i];

                        ids.push(outfit.id);
                        figures.push(outfit.figure);
                    }

                    const totalIds = ids.length;
                    const totalFigures  = figures.length;

                    if(totalIds === totalFigures)
                    {
                        this.packet.writeInt(totalIds);

                        for(let i = 0; i < totalIds; i++) this.packet.writeInt(ids[i]);

                        this.packet.writeInt(totalFigures);

                        for(let i = 0; i < totalFigures; i++) this.packet.writeString(figures[i]);

                        return this.packet.prepare();
                    }
                }
            }

            return this.packet.writeInt(0, 0).prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}