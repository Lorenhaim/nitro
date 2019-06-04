import { RoomModelBlockedTilesComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RoomModelBlockedTilesEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(!this.client.user.unit.isOwner()) return;

            this.client.processOutgoing(new RoomModelBlockedTilesComposer(currentRoom));
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