import { Incoming } from '../Incoming';

export class PetRideEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const pet = currentRoom.petManager.getPet(this.packet.readInt());

            if(!pet) return;
            
            pet.ridePet(this.client.user.unit);
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