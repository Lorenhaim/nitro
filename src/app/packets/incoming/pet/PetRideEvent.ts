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

            if(this.client.user.unit.connectedUnit && this.client.user.unit.connectedUnit === pet.unit) return pet.stopRiding();
            else pet.ridePet(this.client.user.unit);
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