import { Incoming } from '../Incoming';

export class ClientToolbarToggleEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            return this.client.user.details.toggleClientToolbar(this.packet.readInt());
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
