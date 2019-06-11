import { Nitro } from '../../../../Nitro';
import { Incoming } from '../../Incoming';

export class RoomRightsRemoveOwnEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const roomId = this.packet.readInt();

            if(!roomId) return;

            const room = await Nitro.gameManager.roomManager.getRoom(roomId);

            if(!room) return;

            await room.securityManager.removeRights(this.client.user, this.client.user.id);
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