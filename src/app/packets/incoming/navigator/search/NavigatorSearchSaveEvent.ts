import { Incoming } from '../../Incoming';

export class NavigatorSearchSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const searchQuery = this.packet.readString();

            const something2 = this.packet.bytesAvailable ? this.packet.readString() : null;
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