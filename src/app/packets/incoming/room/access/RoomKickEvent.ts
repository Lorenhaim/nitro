import { GenericError } from '../../../../common';
import { UnitType } from '../../../../game';
import { GenericErrorComposer } from '../../../outgoing';
import { Incoming } from '../../Incoming';

export class RoomKickEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            if(!this.client.user.unit.hasRights()) return;

            const unit = currentRoom.unitManager.getUnitByUserId(this.packet.readInt());

            if(!unit) return;

            unit.canLocate = false;

            const doorTile = currentRoom.map.getValidTile(unit, currentRoom.model.doorPosition);

            if(!doorTile)
            {
                unit.user.connections.processOutgoing(new GenericErrorComposer(GenericError.KICKED));

                return unit.reset();
            }

            unit.location.setGoalAction(() => unit.type === UnitType.USER && unit.user.connections.processOutgoing(new GenericErrorComposer(GenericError.KICKED)));

            unit.location.walkTo(doorTile.position, false);
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