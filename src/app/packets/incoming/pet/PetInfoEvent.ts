import { PetInfoComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class PetInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const pet = currentRoom.petManager.getPet(this.packet.readInt());

            if(!pet) return;
            
            this.client.processOutgoing(new PetInfoComposer(pet));
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