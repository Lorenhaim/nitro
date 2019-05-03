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

            console.log(bot, this.packet.readInt());
            
            //this.client.processOutgoing(new PetInfoComposer(pet));
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