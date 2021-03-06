import { RoomMapComposer, RoomModelComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RoomModelEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const loadingRoom = this.client.user.unit.roomLoading;

            if(!loadingRoom) return;
            
            this.client.processOutgoing(
                new RoomMapComposer(loadingRoom),
                new RoomModelComposer(loadingRoom));

            await this.client.user.unit.enterRoomPartTwo();
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