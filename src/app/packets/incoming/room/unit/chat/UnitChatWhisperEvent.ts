import { ChatEvent, ChatType } from '../../../../../game';
import { Incoming } from '../../../Incoming';

export class UnitChatWhisperEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.unit)
            {
                const currentRoom = this.client.user.unit.room;

                const data = this.packet.readString();

                const username = data.substr(0, data.indexOf(' '));
                const message = data.substr(data.indexOf(' '));

                if(currentRoom) currentRoom.events.next(new ChatEvent(this.client.user.unit, message, ChatType.WHISPER, username));
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