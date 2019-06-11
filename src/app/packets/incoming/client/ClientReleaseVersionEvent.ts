import { Nitro } from '../../../Nitro';
import { Incoming } from '../Incoming';

export class ClientReleaseVersionEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(Nitro.config.game.login.security.validateProduction)
            {
                if(Nitro.config.general.production !== this.packet.readString()) await this.client.dispose();
            }
        }

        catch(err)
        {
            await this.client.dispose();

            this.error(err);
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}