import { Incoming } from '../Incoming';

export class ClientVariablesEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const unknown               = this.packet.readInt();
            const clientBasePath        = this.packet.readString();
            const clientVariablesPath   = this.packet.readString();
        }

        catch(err)
        {
            await this.client.dispose();

            this.error(err);
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}