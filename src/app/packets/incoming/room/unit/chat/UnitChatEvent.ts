import { Emulator } from '../../../../../Emulator';
import { ChatType } from '../../../../../game';
import { Incoming } from '../../../Incoming';

export class UnitChatEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(!this.client.user.unit) return;

            const message = this.packet.readString();

            if(!message) return;

            if(await Emulator.gameManager.commandManager.processMessageAsCommand(this.client.user, message)) return;

            this.client.user.unit.chat(ChatType.NORMAL, message);
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