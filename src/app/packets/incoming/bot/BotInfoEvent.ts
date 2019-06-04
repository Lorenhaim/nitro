import { Incoming } from '../Incoming';

export class BotInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const bot = currentRoom.botManager.getBot(this.packet.readInt());

            if(!bot) return;
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