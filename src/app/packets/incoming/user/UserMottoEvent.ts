import { Incoming } from '../Incoming';

export class UserMottoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.user.details.updateMotto(this.packet.readString());
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