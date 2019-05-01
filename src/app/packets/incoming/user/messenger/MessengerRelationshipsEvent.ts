import { MessengerRelationshipsComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class MessengerRelationshipsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            this.client.processOutgoing(new MessengerRelationshipsComposer(this.packet.readInt()));
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