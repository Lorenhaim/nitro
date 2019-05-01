import { Incoming } from '../../Incoming';

export class UserTagsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const userId = this.packet.readInt();
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