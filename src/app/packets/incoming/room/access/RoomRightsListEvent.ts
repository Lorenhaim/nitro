import { RoomRightsListComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RoomRightsListEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(this.client.user.unit.isOwner()) this.client.user.connections.processOutgoing(new RoomRightsListComposer(currentRoom));
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