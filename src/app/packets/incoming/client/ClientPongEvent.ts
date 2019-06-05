import { Incoming } from '../Incoming';

export class ClientPongEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            // received pong
        }

        catch(err)
        {
            this.error(err);
        }
    }
}