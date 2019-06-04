import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserClothingComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_CLOTHING);
    }

    public compose(): OutgoingPacket
    {
        const clothing = this.client.user.inventory.clothing.clothingIds;

        if(!clothing) return this.packet.writeInt(0, 0).prepare();

        const totalClothing = clothing.length;

        if(!totalClothing) return this.packet.writeInt(0, 0).prepare();
        
        this.packet.writeInt(totalClothing);
        
        for(let i = 0; i < totalClothing; i++) this.packet.writeInt(clothing[i]);
        
        return this.packet.writeInt(0).prepare();
    }
}