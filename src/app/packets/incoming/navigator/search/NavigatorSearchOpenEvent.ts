import { Incoming } from '../../Incoming';

export class NavigatorSearchOpenEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const openQuery = this.packet.readString();
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