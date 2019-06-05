import { Incoming } from '../Incoming';

export class ClientPongEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            console.log(`Received Pong`);
        }

        catch(err)
        {
            this.error(err);
        }
    }
}