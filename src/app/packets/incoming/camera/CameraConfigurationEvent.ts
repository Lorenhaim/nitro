import { CameraPriceComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class CameraConfigurationEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new CameraPriceComposer());
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