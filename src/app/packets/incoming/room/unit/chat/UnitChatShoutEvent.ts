import { ChatType } from '../../../../../game';
import { Nitro } from '../../../../../Nitro';
import { Incoming } from '../../../Incoming';

export class UnitChatShoutEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(!this.client.user.unit) return;

            const message = this.packet.readString();

            if(!message) return;

            if(await Nitro.gameManager.commandManager.processMessageAsCommand(this.client.user, message)) return;

            this.client.user.unit.chat(ChatType.SHOUT, message);
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