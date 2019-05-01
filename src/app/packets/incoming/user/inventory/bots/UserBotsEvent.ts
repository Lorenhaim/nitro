import { UserBotsComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class UserBotsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserBotsComposer());
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