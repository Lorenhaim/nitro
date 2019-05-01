import { ChatEvent, ChatType } from '../../../../../game';
import { Incoming } from '../../../Incoming';

export class UnitChatEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.unit)
            {
                const currentRoom = this.client.user.unit.room;

                if(currentRoom) currentRoom.events.next(new ChatEvent(this.client.user.unit, this.packet.readString(), ChatType.NORMAL));
            }
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