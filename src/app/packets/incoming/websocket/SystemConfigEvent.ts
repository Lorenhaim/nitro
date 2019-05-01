import { SystemConfigComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class SystemConfigEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new SystemConfigComposer());
        }

        catch(err)
        {
            this.error(err);
        }
    }
}