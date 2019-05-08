import { UnitStatusComposer } from '../../../packets';
import { Unit, UnitStatus, UnitStatusType, UnitType } from '../../unit';
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

    protected async onRun(): Promise<void>
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

            if(!unit.needsUpdate) continue;

            unit.needsUpdate = false;
            updatedUnits.push(unit);
        }
        
        if(updatedUnits.length) this._room.unitManager.processOutgoing(new UnitStatusComposer(...updatedUnits));
    }

    private processUnit(unit: Unit): Promise<void>
    {
        if(unit)
        {
            if(unit.location.rolling) return;
            
            if(unit.location.isWalking)
            {
                if(unit.location.positionNext)
                {
                    const positionPrevious  = unit.location.position.copy();

                    unit.location.position.x = unit.location.positionNext.x;
                    unit.location.position.y = unit.location.positionNext.y;
                    unit.location.updateHeight(unit.location.position);

                    const currentItem = unit.location.getCurrentItem();

                    if(currentItem)
                    {
                        const interaction: any = currentItem.baseItem.interaction;

                        if(interaction)
                        {
                            if(interaction.onStep && unit.type !== UnitType.PET) interaction.onStep(unit, currentItem);
                        }
                    }

                    if(unit.location.clickGoal && unit.location.clickGoal.position && unit.location.clickGoal.item)
                    {
                        if(unit.location.clickGoal.position.compare(unit.location.position))
                        {
                            const interaction: any = unit.location.clickGoal.item.baseItem.interaction;

                            if(interaction) if(interaction.onClick && unit.type !== UnitType.PET) interaction.onClick(unit, unit.location.clickGoal.item);

                            unit.location.setClickGoal(null, null);
                        }
                    }
                }

                if(!unit.canLocate && unit.location.isWalkingSelf)
                {
                    unit.location.stopWalking();
                }

                else if(unit.location.currentPath.length)
                {
                    const nextPosition  = unit.location.currentPath.shift();
                    const nextTile      = unit.room.map.getValidTile(unit, nextPosition);

                    if(nextTile)
                    {
                        const nextItem = nextTile.highestItem;

                        const currentItem = unit.location.getCurrentItem();

                        if(currentItem)
                        {
                            if(currentItem !== nextItem)
                            {
                                const interaction: any = currentItem.baseItem.interaction;

                                if(interaction)
                                {
                                    if(interaction.onLeave && unit.type !== UnitType.PET) interaction.onLeave(unit, currentItem, nextPosition);
                                }
                            }
                        }

                        const currentTile = unit.location.getCurrentTile();

                        if(currentTile) currentTile.removeUnit(unit);

                        nextTile.addUnit(unit);

                        unit.location.removeStatus(UnitStatusType.LAY, UnitStatusType.SIT);
                        unit.location.position.setDirection(unit.location.position.calculateWalkDirection(nextPosition));
                        unit.location.addStatus(new UnitStatus(UnitStatusType.MOVE, `${ nextTile.position.x },${ nextTile.position.y },${ nextTile.walkingHeight + unit.location.additionalHeight }`));
                        unit.location.positionNext = nextPosition;

                        if(nextItem)
                        {
                            const interaction: any = nextItem.baseItem.interaction;

                            if(interaction)
                            {
                                if(nextItem !== currentItem)
                                {
                                    const interaction: any = nextItem.baseItem.interaction;

                                    if(interaction.onEnter && unit.type !== UnitType.PET) interaction.onEnter(unit, nextItem);
                                }

                                if(interaction.beforeStep) interaction.beforeStep(unit, nextItem);
                            }
                        }
                    }
                    else
                    {
                        unit.location.clearPath();
                        unit.location.walkTo(unit.location.positionGoal);

                        return this.processUnit(unit);
                    }
                }
                else unit.location.stopWalking();

                unit.needsUpdate = true;
            }
        }
    }
}