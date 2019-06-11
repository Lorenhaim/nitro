import { Incoming } from '../Incoming';

export class ClientPongEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.receivePong();
        }

        catch(err)
        {
            this.error(err);
        }
    }
}