import { GameClient } from '../../../networking';
import { Incoming } from '../Incoming';

export class ClientPolicyEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client && this.client instanceof GameClient)
            {
                this.client.write(Buffer.from(`<?xml version=\"1.0\"?>\n<!DOCTYPE cross-domain-policy SYSTEM \"/xml/dtds/cross-domain-policy.dtd\">\n<cross-domain-policy>\n<allow-access-from domain=\"*\" to-ports=\"1-31111\" />\n</cross-domain-policy>`, 'utf8'));
            }

            await this.client.dispose();
        }

        catch(err)
        {
            this.error(err);
        }
    }

    public get guestOnly(): boolean
    {
        return true;
    }
}