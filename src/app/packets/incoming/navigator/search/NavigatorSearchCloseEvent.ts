import { Incoming } from '../../Incoming';

export class NavigatorSearchCloseEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const query = this.packet.readString();
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