import { Incoming } from '../Incoming';

export class PetPlaceEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const petId = this.packet.readInt();

            if(!petId) return;
            
            currentRoom.petManager.placePet(this.client.user, petId, null);
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