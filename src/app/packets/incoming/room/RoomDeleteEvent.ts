import { Emulator } from '../../../Emulator';
import { Incoming } from '../Incoming';

export class RoomDeleteEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const room = await Emulator.gameManager.roomManager.getRoom(this.packet.readInt());

            if(!room) return;

            await room.init();

            await Emulator.gameManager.roomManager.deleteRoom(room, this.client.user);
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