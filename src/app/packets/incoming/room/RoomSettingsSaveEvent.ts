import { Emulator } from '../../../Emulator';
import { RoomSettingsSaveError } from '../../../game';
import { RoomSettingsSaveErrorComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomSettingsSaveEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const room = await Emulator.gameManager.roomManager.getRoom(this.packet.readInt());

            if(!room) return;

            if(!room.securityManager.isOwner(this.client.user)) return;

            const roomName = this.packet.readString();

            this.client.processOutgoing(new RoomSettingsSaveErrorComposer(room.id, RoomSettingsSaveError.BAD_NAME, ''));
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