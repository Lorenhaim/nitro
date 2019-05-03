import { Incoming } from '../Incoming';

export class BotPickupEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const botId = this.packet.readInt();

            if(!botId) return;

            console.log(botId);
            
            await currentRoom.botManager.pickupBot(this.client.user, botId);
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