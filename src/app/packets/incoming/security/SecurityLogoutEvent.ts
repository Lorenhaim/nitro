import { SocketClient } from '../../../networking';
import { SecurityLogoutComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SecurityLogoutEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client instanceof SocketClient)
            {
                await this.client.logout();

                this.client.processOutgoing(new SecurityLogoutComposer());
            }
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