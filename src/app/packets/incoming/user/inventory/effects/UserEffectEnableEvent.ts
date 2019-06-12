import { Incoming } from '../../../Incoming';

export class UserEffectEnableEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.user.inventory.effects.enableEffect(this.packet.readInt());
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