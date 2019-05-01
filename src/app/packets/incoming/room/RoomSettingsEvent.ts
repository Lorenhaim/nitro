import { Emulator } from '../../../Emulator';
import { RoomSettingsComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomSettingsEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const room = await Emulator.gameManager.roomManager.getRoom(this.packet.readInt());

            if(!room) return;

            if(!room.securityManager.isOwner(this.client.user)) return;

            this.client.processOutgoing(new RoomSettingsComposer(room));
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