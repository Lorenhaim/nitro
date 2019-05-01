import { Incoming } from '../Incoming';

export class NavigatorPromotedRoomsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            // send list of rooms that are promoted
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