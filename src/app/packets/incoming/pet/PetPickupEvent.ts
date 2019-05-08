import { Incoming } from '../Incoming';

export class PetPickupEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const petId = this.packet.readInt();

            if(!petId) return;
            
            currentRoom.petManager.pickupPet(this.client.user, petId);
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