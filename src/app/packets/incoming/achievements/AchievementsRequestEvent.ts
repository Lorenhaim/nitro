import { AchievementListComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class AchievementsRequestEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new AchievementListComposer());
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