import { RoomMapComposer, RoomModelComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomModelEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const loadingRoom = this.client.user.unit.roomLoading;

            if(!loadingRoom) return;
            // const currentRoom = this.client.user.unit.room;

            // if(!currentRoom) return;
            
            this.client.processOutgoing(
                new RoomMapComposer(loadingRoom),
                new RoomModelComposer(loadingRoom));

            this.client.user.unit.enterRoomPartTwo();
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