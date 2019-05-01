import { Incoming } from '../Incoming';

export class RoomFavoriteEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            //
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