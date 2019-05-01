import { Incoming } from '../../Incoming';

export class MessengerRequestEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            await this.client.user.messenger.sendRequest(0, this.packet.readString());
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