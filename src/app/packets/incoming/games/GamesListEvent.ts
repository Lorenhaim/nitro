import { GameCenterAchievementsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class GamesListEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new GameCenterAchievementsComposer());
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