import { Nitro } from '../../../Nitro';
import { UnitStatusComposer } from '../../../packets';
import { Position } from '../../pathfinder';
import { Unit, UnitStatus, UnitStatusType } from '../../unit';
import { Room } from '../Room';
import { Task } from './Task';

export class UnitActionTask extends Task
{
    private _room: Room;

    constructor(room: Room)
    {
        super('UnitAction');

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    protected onRun(): void
    {
        const updatedUnits: Unit[] = [];

        const currentUnits = this._room.unitManager.units;

        if(!currentUnits) return;
        
        const totalUnits = currentUnits.length;

        if(!totalUnits) return;
        
        for(let i = 0; i < totalUnits; i++)
        {
            const unit = currentUnits[i];

            if(!unit) continue;

            if(unit.location.teleporting) unit.location.teleporting.processTeleport();

            if(unit.needsInvoke) unit.location.invokeCurrentItem();

            if(unit.skipUpdate)
            {
                unit.skipUpdate = false;

                continue;
            }

            this.processUnit(unit);

            if(unit.room !== this._room) continue;

            if(!unit.needsUpdate) continue;

            unit.needsUpdate = false;
            updatedUnits.push(unit);
        }
        
        if(updatedUnits.length) this._room.unitManager.processOutgoing(new UnitStatusComposer(...updatedUnits));
    }

    private processUnit(unit: Unit): void
    {
        if(!unit) return;
        
        if(unit.location.rolling) return;
            
        if(!unit.location.isWalking) return;

        unit.location.processNextPosition();

        if(!unit.canLocate && unit.location.isWalkingSelf) return unit.location.stopWalking();

        else if(unit.location.currentPath.length)
        {
            const nextPosition = unit.location.currentPath.shift();

            if(nextPosition.compare(unit.location.position)) return unit.location.stopWalking();

            if(!nextPosition) return unit.location.stopWalking();

            const nextTile = unit.room.map.getValidTile(unit, nextPosition, unit.location.currentPath.length === 0);

            if(!nextTile) return this.retryPath(unit);

            if(Nitro.config.game.pathfinder.steps.allowDiagonals)
            {
                const firstCheck    = unit.room.map.getValidDiagonalTile(unit, new Position(nextPosition.x, unit.location.position.y));
                const secondCheck   = unit.room.map.getValidDiagonalTile(unit, new Position(unit.location.position.x, nextPosition.y));

                if(!firstCheck && !secondCheck) return unit.location.stopWalking();
            }
            
            const nextItem      = nextTile.highestItem;
            const currentItem   = unit.location.getCurrentItem();

            if(currentItem)
            {
                if(currentItem !== nextItem)
                {
                    const interaction: any = currentItem.baseItem.interaction;

                    if(interaction && interaction.onLeave) interaction.onLeave(unit, currentItem, nextPosition);
                }
            }

            const currentTile = unit.location.getCurrentTile();

            if(currentTile) currentTile.removeUnit(unit);

            nextTile.addUnit(unit);

            unit.location.removeStatus(UnitStatusType.LAY, UnitStatusType.SIT);
            unit.location.addStatus(new UnitStatus(UnitStatusType.MOVE, `${ nextTile.position.x },${ nextTile.position.y },${ nextTile.walkingHeight + unit.location.additionalHeight }`));

            unit.location.position.setDirection(unit.location.position.calculateWalkDirection(nextPosition));
            
            unit.location.positionNext = nextPosition;

            if(nextItem)
            {
                const interaction: any = nextItem.baseItem.interaction;

                if(interaction)
                {
                    if(interaction.beforeStep) interaction.beforeStep(unit, nextItem);

                    if(nextItem !== currentItem)
                    {
                        if(interaction.onEnter) interaction.onEnter(unit, nextItem);
                    }
                }
            }

            unit.needsUpdate = true;
        }

        else return unit.location.stopWalking();
    }

    private retryPath(unit: Unit): void
    {
        if(!unit) return;

        unit.location.clearPath();
        unit.location.walkTo(unit.location.positionGoal);

        return this.processUnit(unit);
    }
}