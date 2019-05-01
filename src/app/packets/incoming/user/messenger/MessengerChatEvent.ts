import { Incoming } from '../../Incoming';

export class MessengerChatEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            await this.client.user.messenger.sendMessage(this.packet.readInt(), this.packet.readString());
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