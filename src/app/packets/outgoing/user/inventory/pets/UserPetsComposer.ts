import { Outgoing } from '../../../Outgoing';
import { OutgoingHeader } from '../../../OutgoingHeader';
import { OutgoingPacket } from '../../../OutgoingPacket';

export class UserPetsComposer extends Outgoing
{
    constructor()
    {
        super(OutgoingHeader.USER_PETS);
    }

    public compose(): OutgoingPacket
    {
        this.packet.writeInt(1, 1);

        const pets = this.client.user.inventory.pets.pets;

        if(!pets) return this.packet.writeInt(0).prepare();
        
        const totalPets = pets.length;

        if(!totalPets) return this.packet.writeInt(0).prepare();
        
        this.packet.writeInt(totalPets);

        for(let i = 0; i < totalPets; i++) pets[i].parseInventoryData(this.packet);
        
        return this.packet.prepare();
    }
}