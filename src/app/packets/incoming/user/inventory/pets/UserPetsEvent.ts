import { UserPetsComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class UserPetsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new UserPetsComposer());
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