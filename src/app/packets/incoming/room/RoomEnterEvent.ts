import { Incoming } from '../Incoming';

export class RoomEnterEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            if(this.client.user.unit !== null) await this.client.user.unit.enterRoomPartOne(this.packet.readInt(), this.packet.readString(), false);
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