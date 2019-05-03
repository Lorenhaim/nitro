import { Direction, Position } from '../../../game';
import { Incoming } from '../Incoming';

export class BotPlaceEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const botId = this.packet.readInt();

            if(!botId) return;
            
            await currentRoom.botManager.placeBot(this.client.user, botId, new Position(this.packet.readInt(), this.packet.readInt(), 0, Direction.SOUTH, Direction.SOUTH));
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