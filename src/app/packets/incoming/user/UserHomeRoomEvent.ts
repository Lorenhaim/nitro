import { Incoming } from '../Incoming';

export class UserHomeRoomEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.user.details.updateHomeRoom(this.packet.readInt());
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