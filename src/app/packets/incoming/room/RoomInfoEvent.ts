import { Nitro } from '../../../Nitro';
import { RoomInfoComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomInfoEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const roomId        = this.packet.readInt();
            const someBoolean   = this.packet.readInt() === 0 && this.packet.readInt() === 1 ? false : true;

            const room = await Nitro.gameManager.roomManager.getRoom(roomId);

            if(!room) return;

            await room.init();

            if(!room.isLoaded) return;
            
            return this.client.processOutgoing(new RoomInfoComposer(room, true, someBoolean));
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