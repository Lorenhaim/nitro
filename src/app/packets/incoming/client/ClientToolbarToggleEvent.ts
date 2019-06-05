import { Incoming } from '../Incoming';

export class ClientToolbarToggleEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.user.details.toggleClientToolbar();
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
