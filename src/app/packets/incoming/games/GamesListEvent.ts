import { Incoming } from '../Incoming';

export class GamesListEvent extends Incoming
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