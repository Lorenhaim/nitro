import { UnitType } from '../../../../game';
import { Incoming } from '../../Incoming';

export class RoomTradeEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const unit = currentRoom.unitManager.getUnit(this.packet.readInt());

            if(!unit) return;

            if(unit.type !== UnitType.USER) return;

            if(!unit.user) return;

            currentRoom.unitManager.startTrading(this.client.user.unit, unit);
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