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
        try
        {
            this.packet.writeInt(1, 1);

            const pets = this.client.user.inventory.pets.pets;

            if(pets)
            {
                const totalPets = pets.length;

                if(totalPets)
                {
                    this.packet.writeInt(totalPets);

                    for(let i = 0; i < totalPets; i++) pets[i].parseInventoryData(this.packet);
                }
                else this.packet.writeInt(0);
            }
            else this.packet.writeInt(0);
            
            return this.packet.prepare();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}