import { Direction, Position } from '../../../game';
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
            
            currentRoom.petManager.placePet(this.client.user, petId, new Position(this.packet.readInt(), this.packet.readInt(), 0, Direction.SOUTH, Direction.SOUTH));
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