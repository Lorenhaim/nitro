import { Nitro } from '../../../Nitro';
import { GroupInfoComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class GroupInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const group = await Nitro.gameManager.groupManager.getGroup(this.packet.readInt());

            if(!group) return;

            this.client.processOutgoing(new GroupInfoComposer(group, this.packet.readBoolean()));
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