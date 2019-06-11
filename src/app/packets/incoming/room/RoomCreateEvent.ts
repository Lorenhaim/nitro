import { Nitro } from '../../../Nitro';
import { RoomCreatedComposer } from '../../outgoing';
import { Incoming } from '../Incoming';

export class RoomCreateEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const name          = this.packet.readString();
            const description   = this.packet.readString();
            const modelName     = this.packet.readString();
            const categoryId    = this.packet.readInt();
            const usersMax      = this.packet.readInt();
            const tradeType     = this.packet.readInt();

            const roomId = await Nitro.gameManager.roomManager.createRoom(this.client.user, {
                name,
                description,
                modelName,
                categoryId,
                usersMax,
                tradeType
            });

            if(roomId > 0) this.client.processOutgoing(new RoomCreatedComposer(roomId, name));
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