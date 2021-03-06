import { PermissionList } from '../../../game';
import { Nitro } from '../../../Nitro';
import { ModerationUserInfoComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class ModerationUserInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const user = await Nitro.gameManager.userManager.getOfflineUserById(this.packet.readInt());

            if(!user) return;

            return this.client.processOutgoing(new ModerationUserInfoComposer(user));
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

    public get permissionRequired(): string[]
    {
        return [ PermissionList.MOD_TOOL ];
    }
}