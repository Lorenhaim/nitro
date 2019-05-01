import { BadgesComposer } from '../../../../outgoing';
import { Incoming } from '../../../Incoming';

export class BadgesEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(!this.client.user.inventory.badges.isLoaded) await this.client.user.inventory.badges.init();
            
            this.client.processOutgoing(new BadgesComposer());
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