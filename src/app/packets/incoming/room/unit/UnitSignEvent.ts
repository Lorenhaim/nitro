import { Incoming } from '../../Incoming';

export class UnitSignEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(currentRoom)
            {
                if(this.client.user.unit.canLocate) this.client.user.unit.location.sign(this.packet.readInt());
            }
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