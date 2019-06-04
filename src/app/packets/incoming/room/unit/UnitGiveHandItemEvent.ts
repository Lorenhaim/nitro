import { UnitHandItem } from '../../../../game';
import { Incoming } from '../../Incoming';

export class UnitGiveHandItemEvent extends Incoming
{
    public async process(): Promise<void>
    {
        try
        {
            const currentRoom = this.client.user.unit.room;

            if(!currentRoom) return;

            const unit = currentRoom.unitManager.getUnitByUserId(this.packet.readInt());

            if(!unit) return;

            if(!this.client.user.unit.location.position.isNear(unit.location.position))
            {
                this.client.user.unit.location.setGoalAction(() =>
                {
                    if(!this.client.user.unit.location.position.isNear(unit.location.position)) return;

                    this.client.user.unit.location.lookAtPosition(unit.location.position);
                
                    unit.location.lookAtPosition(this.client.user.unit.location.position);

                    unit.location.hand(this.client.user.unit.location.handType);

                    this.client.user.unit.location.hand(UnitHandItem.NONE);
                });

                return this.client.user.unit.location.walkToUnit(unit);
            }
            else
            {
                this.client.user.unit.location.lookAtPosition(unit.location.position);

                unit.location.lookAtPosition(this.client.user.unit.location.position);

                unit.location.hand(this.client.user.unit.location.handType);

                this.client.user.unit.location.hand(UnitHandItem.NONE);
            }

            // const positionFront = unit.location.position.getPositionInfront().copy();

            // if(!positionFront) return;

            // if(!this.client.user.unit.location.position.compare(positionFront))
            // {
            //     const goalTile = currentRoom.map.getValidTile(this.client.user.unit, positionFront);

            //     if(!goalTile) return;

            //     this.client.user.unit.location.setGoalAction(() =>
            //     {
            //         if(!this.client.user.unit.location.position.isNear(unit.location.position)) return;

            //         unit.location.hand(this.client.user.unit.location.handType);

            //         this.client.user.unit.location.hand(UnitHandItem.NONE);
            //     });

            //     this.client.user.unit.location.walkTo(positionFront);
            // }
            // else
            // {
            //     unit.location.hand(this.client.user.unit.location.handType);

            //     this.client.user.unit.location.hand(UnitHandItem.NONE);
            // }
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