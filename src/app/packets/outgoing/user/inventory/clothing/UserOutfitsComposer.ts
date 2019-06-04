import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserOutfitsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_OUTFITS);
    }

    public compose(): OutgoingPacket
    {
        const outfits = this.client.user.inventory.outfits.outfits;

        if(!outfits) return this.packet.writeInt(1, 0).prepare();

        const totalOutfits = outfits.length;

        if(!totalOutfits) return this.packet.writeInt(1, 0).prepare();
        
        this.packet.writeInt(1, totalOutfits);
        
        for(let i = 0; i < totalOutfits; i++)
        {
            const outfit = outfits[i];

            this.packet.writeInt(outfit.slotNumber).writeString(outfit.figure, outfit.gender.toUpperCase());
        }
        
        return this.packet.prepare();
    }
}