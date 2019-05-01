import { Incoming } from '../../Incoming';

export class MessengerRelationshipUpdateEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            await this.client.user.messenger.updateRelation(this.packet.readInt(), <any> this.packet.readInt());
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