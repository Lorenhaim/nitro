import { RoomModelDoorComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RoomModelDoorEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const room = this.client.user.unit.roomLoading || this.client.user.unit.room;

            if(!room) return;

            this.client.processOutgoing(new RoomModelDoorComposer(room));
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