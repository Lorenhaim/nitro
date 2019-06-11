import { Outgoing, UnitRollingComposer } from '../../../packets';
import { RollingComposer } from '../../../packets/outgoing/room/RollingComposer';
import { BaseItemType, InteractionRoller, Item, ItemRolling, RollerData } from '../../item';
import { Position } from '../../pathfinder';
import { Unit, UnitRolling } from '../../unit';
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

    protected onRun(): void
    {
        const rollers = this._room.itemManager.getItemsByInteraction(InteractionRoller);

        if(!rollers) return;

        const totalRollers = rollers.length;

        if(!totalRollers) return;

        const rollersRolling: RollerData[]  = [];
        const updatedPositions: Position[]  = [];
        const pendingOutgoing: Outgoing[]   = [];
        
        for(let i = 0; i < totalRollers; i++)
        {
            const roller = rollers[i];

            if(!roller) continue;

            const tile = roller.getTile();

            if(!tile) continue;

            const rollerData = new RollerData(roller);

            if(!rollerData) continue;

            if(tile.items)
            {
                const totalItems = tile.items.length;

                if(totalItems)
                {
                    for(let j = 0; j < totalItems; j++)
                    {
                        const item = tile.items[j];

                        if(!item) continue;

                        if(item === roller) continue;

                        if(item.baseItem.hasInteraction(InteractionRoller)) continue;

                        this.processItem(rollerData, item);
                    }
                }
            }

            if(tile.units)
            {
                const totalUnits = tile.units.length;

                if(totalUnits)
                {
                    for(let j = 0; j < totalUnits; j++)
                    {
                        const unit = tile.units[j];

                        if(!unit) continue;
                        
                        this.processUnit(rollerData, unit);
                    }
                }
            }

            if(rollerData.items.length || rollerData.units.length) rollersRolling.push(rollerData);
        }

        const totalRollersRolling = rollersRolling.length;

        if(totalRollersRolling)
        {
            for(let i = 0; i < totalRollersRolling; i++)
            {
                const roller = rollersRolling[i];

                if(!roller) continue;

                const totalItems = roller.items.length;
                const totalUnits = roller.units.length;

                if(totalItems || totalUnits) updatedPositions.push(roller.position, roller.positionNext);

                if(totalItems)
                {
                    for(let j = 0; j < totalItems; j++)
                    {
                        const item = roller.items[j];

                        if(!item || !item.rolling || !item.rolling.rollerData) continue;

                        this.finishItemRoll(item);
                    }
                }

                if(totalUnits)
                {
                    for(let j = 0; j < totalUnits; j++)
                    {
                        const unit = roller.units[j];

                        if(!unit || !unit.location.rolling || !unit.location.rolling.rollerData) continue;

                        this.finishUnitRoll(unit);
                    }
                }

                if(!totalUnits)
                {
                    pendingOutgoing.push(new RollingComposer(roller));
                }
                else
                {
                    let didSend = false;

                    for(let j = 0; j < totalUnits; j++)
                    {
                        const unit = roller.units[j];

                        if(!unit) continue;

                        if(!didSend) pendingOutgoing.push(new RollingComposer(roller, unit));
                        else pendingOutgoing.push(new UnitRollingComposer(roller, unit));

                        didSend = true;
                    }
                }
            }

            if(updatedPositions.length) this._room.map.updatePositions(false, ...updatedPositions);

            if(pendingOutgoing.length) this._room.unitManager.processOutgoing(...pendingOutgoing);

            setTimeout(() =>
            {
                const totalRollersRolling = rollersRolling.length;

                if(!totalRollersRolling) return;

                for(let i = 0; i < totalRollersRolling; i++)
                {
                    const roller = rollersRolling[i];

                    if(!roller) continue;

                    roller.finishRoll();
                }
            }, 500);
        }
    }

    private processItem(rollerData: RollerData, item: Item, validateOnly: boolean = false): Position
    {
        if(!rollerData || !item) return null;

        if(!rollerData.roller || !rollerData.position || !rollerData.positionNext) return null;

        if(item.id === rollerData.roller.id) return null;

        if(!item.position.compare(rollerData.roller.position)) return null;

        if(item.position.z < rollerData.roller.position.z) return null;

        const currentTile   = rollerData.getTile();
        const goalTile      = rollerData.getGoalTile();

        if(!currentTile || !goalTile) return;

        const totalUnits = this._room.unitManager.units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const activeUnit = this._room.unitManager.units[i];

                if(!activeUnit) continue;

                if(activeUnit.location.positionNext)
                {
                    if(activeUnit.location.positionNext.compare(goalTile.position)) return null;
                }

                if(activeUnit.location.isWalking) continue;

                if(activeUnit.location.rolling && activeUnit.location.rolling.rollerData)
                {
                    if(activeUnit.location.position.compare(currentTile.position)) continue;

                    if(activeUnit.location.rolling.rollerData.positionNext.compare(goalTile.position)) return null;
                }

                if(activeUnit.location.position.compare(goalTile.position)) return null;
            }
        }

        const floorItems = this._room.itemManager.getItemsByType(BaseItemType.FLOOR);

        if(floorItems)
        {
            const totalItems = floorItems.length;

            if(totalItems)
            {
                for(let i = 0; i < totalItems; i++)
                {
                    const activeItem = floorItems[i];

                    if(!activeItem) continue;

                    if(activeItem.rolling && activeItem.rolling.rollerData)
                    {
                        if(activeItem.position.compare(currentTile.position)) continue;

                        if(activeItem.rolling.rollerData.positionNext.compare(goalTile.position)) return null;
                    }
                }
            }
        }

        if(!item.isValidPlacement(goalTile.position, null, true)) return null;

        let nextHeight = item.position.z + 0;

        if(!goalTile.hasInteraction(InteractionRoller)) nextHeight -= rollerData.roller.baseItem.stackHeight;

        if(!validateOnly)
        {
            item.rolling = new ItemRolling(item, rollerData, item.position.z + 0, nextHeight);

            rollerData.items.push(item);
        }

        return rollerData.positionNext;
    }

    private finishItemRoll(item: Item): void
    {
        if(!item || !item.rolling || !item.rolling.rollerData) return;

        item.position.x = item.rolling.rollerData.positionNext.x;
        item.position.y = item.rolling.rollerData.positionNext.y;
        item.position.z = item.rolling.nextHeight;

        item.save();
    }

    private processUnit(rollerData: RollerData, unit: Unit): Position
    {
        if(!rollerData || !unit) return null;

        if(!rollerData.roller || !rollerData.position || !rollerData.positionNext) return null;

        if(unit.location.isWalking) return null;

        if(!unit.location.position.compare(rollerData.roller.position)) return null;

        if(unit.location.position.z < rollerData.roller.position.z) return null;

        const currentTile   = rollerData.getTile();
        const goalTile      = rollerData.getGoalTile();

        if(!currentTile || !goalTile) return;

        if(!currentTile.canWalk) return;

        const totalUnits = this._room.unitManager.units.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const activeUnit = this._room.unitManager.units[i];

                if(!activeUnit) continue;

                if(activeUnit.location.positionNext)
                {
                    if(activeUnit.location.positionNext.compare(goalTile.position)) return null;
                }

                if(activeUnit.location.isWalking) continue;

                if(activeUnit.location.rolling && activeUnit.location.rolling.rollerData)
                {
                    if(activeUnit.location.position.compare(currentTile.position)) continue;

                    if(activeUnit.location.rolling.rollerData.positionNext.compare(goalTile.position)) return null;
                }

                if(activeUnit.location.position.compare(goalTile.position)) return null;
            }
        }

        if(!this._room.map.getValidTile(unit, goalTile.position)) return;

        const currentItem = unit.location.getCurrentItem();

        if(currentItem)
        {
            if(!currentItem.baseItem.hasInteraction(InteractionRoller))
            {
                if(this.processItem(rollerData, currentItem, true) === null) return;
            }
        }

        let nextHeight = unit.location.position.z + 0;

        if(!goalTile.hasInteraction(InteractionRoller)) nextHeight -= rollerData.roller.baseItem.stackHeight;

        unit.location.rolling = new UnitRolling(unit, rollerData, unit.location.position.z + 0, nextHeight);

        rollerData.units.push(unit);
    }

    private finishUnitRoll(unit: Unit): void
    {
        if(!unit || !unit.location.rolling || !unit.location.rolling.rollerData) return;

        const currentTile   = unit.location.rolling.rollerData.getTile();
        const nextTile      = unit.location.rolling.rollerData.getGoalTile();

        if(!currentTile || !nextTile) return;

        unit.location.position.x = unit.location.rolling.rollerData.positionNext.x;
        unit.location.position.y = unit.location.rolling.rollerData.positionNext.y;
        unit.location.position.z = unit.location.rolling.nextHeight;

        currentTile.removeUnit(unit);
        nextTile.addUnit(unit);
    }
}