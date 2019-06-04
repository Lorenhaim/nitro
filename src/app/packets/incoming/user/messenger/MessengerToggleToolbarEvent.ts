import { Incoming } from '../../Incoming';

export class MessengerToggleToolbarEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.user.details.toggleFriendToolbar();
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