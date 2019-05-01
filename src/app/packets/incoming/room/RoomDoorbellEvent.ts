import { Incoming } from '../Incoming';

export class RoomDoorbellEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const username  = this.packet.readString();
            const accepted  = this.packet.readBoolean();

            if(this.client.user.unit && this.client.user.unit.hasRights)
            {
                if(accepted) await this.client.user.unit.room.unitManager.acceptQueuingUnit(username);
                else await this.client.user.unit.room.unitManager.removeQueuingUnit(null, username, true, false);
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