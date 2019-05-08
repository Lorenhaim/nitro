import { ItemRollingComposer, Outgoing, UnitRollingComposer } from '../../../packets';
import { InteractionRoller, Item, ItemRolling } from '../../item';
import { Position } from '../../pathfinder';
import { Unit, UnitRolling, UnitStatusType } from '../../unit';
import { Room } from '../Room';
import { Task } from './Task';

export class RollerTask extends Task
{
    private _room: Room;

    constructor(room: Room)
    {
        super('Roller');

        if(!(room instanceof Room)) throw new Error('invalid_room');

        this._room = room;
    }

    protected async onRun(): Promise<void>
    {
        const rollers = this._room.itemManager.getItemsByInteraction(InteractionRoller);

        if(!rollers) return;

        const totalRollers = rollers.length;

        if(!totalRollers) return;

        const updatedPositions: Position[] = [];

        const itemsRolling: Item[]  = [];
        const unitsRolling: Unit[]  = [];

        const pendingOutgoing: Outgoing[] = [];
        
        for(let i = 0; i < totalRollers; i++)
        {
            const roller = rollers[i];

            if(!roller) continue;

            const tile = roller.getTile();

            if(!tile) continue;

            const tileItems = tile.items;
            const tileUnits = tile.units;

            if(tileItems)
            {
                const totalItems = tileItems.length;

                if(totalItems)
                {
                    for(let j = 0; j < totalItems; j++)
                    {
                        const item = tileItems[j];

                        if(!item) continue;

                        if(item === roller) continue;

                        if(item.baseItem.hasInteraction(InteractionRoller)) continue;

                        const nextPosition = this.processItem(item, roller);

                        if(nextPosition) itemsRolling.push(item);
                    }
                }
            }

            if(tileUnits)
            {
                const totalUnits = tileUnits.length;

                if(totalUnits)
                {
                    for(let j = 0; j < totalUnits; j++)
                    {
                        const unit = tileUnits[j];

                        if(!unit) continue;

                        const positionNext = this.processUnit(unit, roller);

                        if(positionNext) unitsRolling.push(unit);
                    }
                }
            }
        }

        const totalUnits    = unitsRolling.length;
        const totalItems    = itemsRolling.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const unit = unitsRolling[i];

                if(!unit) continue;

                if(!unit.location.rolling) continue;

                this.finishUnitRoll(unit);

                pendingOutgoing.push(new UnitRollingComposer(unit));
            }
        }

        if(totalItems)
        {
            for(let i = 0; i < totalItems; i++)
            {
                const item = itemsRolling[i];

                if(!item) continue;

                if(!item.rolling) continue;

                this.finishItemRoll(item);

                pendingOutgoing.push(new ItemRollingComposer(item));

                updatedPositions.push(item.rolling.position, item.rolling.positionNext);
            }
        }

        this._room.map.generateCollisions();

        if(updatedPositions.length) this._room.map.updatePositions(false, ...updatedPositions);

        if(pendingOutgoing.length) this._room.unitManager.processOutgoing(...pendingOutgoing);

        if(totalUnits) for(let i = 0; i < totalUnits; i++) unitsRolling[i].location.rolling = null;

        if(totalItems) for(let i = 0; i < totalItems; i++) itemsRolling[i].rolling = null;

        setTimeout(() =>
        {
            if(unitsRolling.length)
            {
                this._room.unitManager.updateUnits(...unitsRolling);

                if(totalUnits) for(let i = 0; i < totalUnits; i++) unitsRolling[i].location.rolling = null;
            }

            if(totalItems) for(let i = 0; i < totalItems; i++) itemsRolling[i].rolling = null;
        }, 500);
    }

    private processItem(item: Item, roller: Item): Position
    {
        if(!item || !roller) return null;

        if(item.id === roller.id) return null;

        if(item.position.z < roller.position.z) return null;

        const currentTile   = item.getTile();
        const goalTile      = this._room.map.getTile(roller.position.getPositionInfront());

        if(!currentTile || !goalTile) return null;

        const totalUnits = this._room.unitManager.units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const unit = this._room.unitManager.units[i];

                if(!unit) continue;

                if(unit.location.positionNext)
                {
                    if(unit.location.positionNext.compare(goalTile.position)) return null;
                }

                if(unit.location.isWalking) continue;

                if(unit.location.rolling)
                {
                    if(unit.location.rolling.positionNext.compare(goalTile.position)) return null;
                }

                if(unit.location.position.compare(goalTile.position)) return null;
            }
        }

        const floorItems = this._room.itemManager.getFloorItems();

        if(floorItems)
        {
            const totalItems = floorItems.length;

            if(totalItems)
            {
                for(let i = 0; i < totalItems; i++)
                {
                    const activeItem = floorItems[i];

                    if(!activeItem) continue;

                    if(activeItem.rolling)
                    {
                        if(activeItem.position.compare(roller.position)) continue;

                        if(activeItem.rolling.positionNext.compare(goalTile.position)) return null;
                    }
                }
            }
        }

        if(!item.isValidPlacement(goalTile.position, null, true)) return null;

        let nextHeight = item.position.z + 0;

        if(!goalTile.hasInteraction(InteractionRoller)) nextHeight -= roller.baseItem.stackHeight;

        const nextPosition = new Position(goalTile.position.x, goalTile.position.y, nextHeight);

        item.rolling = new ItemRolling(item, roller, item.position.copy(), nextPosition);

        return nextPosition;
    }

    private finishItemRoll(item: Item): void
    {
        if(!item) return;

        const rollingData = item.rolling;

        if(!rollingData) return;

        item.position.x = rollingData.positionNext.x;
        item.position.y = rollingData.positionNext.y;
        item.position.z = rollingData.positionNext.z;

        item.save();
    }

    private processUnit(unit: Unit, roller: Item): Position
    {
        if(!unit || !roller) return;

        if(!unit.room || !roller.room) return;

        if(unit.room !== roller.room) return;

        if(unit.location.isWalking) return;

        if(!unit.location.position.compare(roller.position)) return;

        if(unit.location.position.z < roller.position.z) return;

        const unitPosition  = unit.location.position.copy();
        const nextPosition  = roller.position.getPositionInfront();

        if(!unitPosition || !nextPosition) return;

        const currentTile   = unit.location.getCurrentTile();
        const nextTile      = unit.room.map.getTile(nextPosition);

        if(!currentTile || !nextTile) return;

        if(!currentTile.canWalk || !nextTile.canWalk) return;

        const totalUnits = roller.room.unitManager.units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const activeUnit = roller.room.unitManager.units[i];

                if(!activeUnit || activeUnit === unit) continue;

                if(activeUnit.location.positionNext)
                {
                    if(activeUnit.location.positionNext.compare(nextPosition)) return;
                }

                if(activeUnit.location.isWalking) continue;

                if(activeUnit.location.rolling)
                {
                    if(activeUnit.location.rolling.positionNext.compare(nextPosition)) return;
                }
                
                if(activeUnit.location.position.compare(nextPosition)) return;
            }
        }

        if(!roller.room.map.getValidTile(unit, nextPosition)) return;

        const currentItem = unit.location.getCurrentItem();

        if(currentItem)
        {
            if(!currentItem.baseItem.hasInteraction(InteractionRoller))
            {
                if(this.processItem(currentItem, roller) === null) return null;
            }
        }

        let nextHeight = unit.location.position.z + 0;

        if(!nextTile.hasInteraction(InteractionRoller)) nextHeight -= roller.baseItem.stackHeight;

        nextPosition.z = nextHeight;

        unit.location.rolling = new UnitRolling(unit, roller, unitPosition, nextPosition);

        return nextPosition;
    }

    private finishUnitRoll(unit: Unit): void
    {
        if(!unit) return;

        const rollingData = unit.location.rolling;

        if(!rollingData) return;

        const currentTile   = unit.location.getCurrentTile();
        const nextTile      = this._room.map.getTile(rollingData.positionNext);

        if(!currentTile || !nextTile) return;

        const sitStatus = unit.location.getStatus(UnitStatusType.SIT);

        if(sitStatus)
        {
            if(parseFloat(sitStatus.value) > 1.0)
            {
                // nextHeight += sitHeight - 1.0;
            }
        }

        unit.location.position.x = rollingData.positionNext.x;
        unit.location.position.y = rollingData.positionNext.y;
        unit.location.position.z = rollingData.positionNext.z;

        currentTile.removeUnit(unit);
        nextTile.addUnit(unit);
    }
}