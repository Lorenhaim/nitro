import { Outgoing, UnitRollingComposer } from '../../../packets';
import { InteractionRoller, Item } from '../../item';
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

    protected async onRun(): Promise<void>
    {
        const rollers = this._room.itemManager.getItemsByInteraction(InteractionRoller);

        if(!rollers) return;

        const totalRollers = rollers.length;

        if(!totalRollers) return;

        const pendingOutgoing: Outgoing[] = [];

        const unitsRolling: Unit[]  = [];
        
        for(let i = 0; i < totalRollers; i++)
        {
            const roller = rollers[i];

            if(!roller) continue;

            const tile = roller.getTile();

            if(!tile) continue;

            const tileUnits = tile.units;

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

                        if(!positionNext) continue;
                        
                        unit.location.rolling = new UnitRolling(unit, roller, unit.location.position.copy(), positionNext);
                            
                        unitsRolling.push(unit);
                    }
                }
            }
        }

        const totalUnits = unitsRolling.length;

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++)
            {
                const unit = unitsRolling[i];

                if(!unit) continue;

                if(!unit.location.rolling) continue;

                unit.location.position.x = unit.location.rolling.positionNext.x;
                unit.location.position.y = unit.location.rolling.positionNext.y;
                unit.location.position.z = unit.location.rolling.positionNext.z;

                unit.room.map.getTile(unit.location.rolling.position).removeUnit(unit);
                unit.room.map.getTile(unit.location.rolling.positionNext).addUnit(unit);
                
                unit.skipUpdate = true;
                unit.location.fastInvoke();

                pendingOutgoing.push(new UnitRollingComposer(unit));
            }
        }

        this._room.map.generateCollisions();

        if(pendingOutgoing.length) this._room.unitManager.processOutgoing(...pendingOutgoing);

        if(totalUnits)
        {
            for(let i = 0; i < totalUnits; i++) unitsRolling[i].location.rolling = null;
        }
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

        let nextHeight          = unitPosition.z;
        let nextRoller: Item    = null;
        let substractRoller     = true;

        const totalItemsNext = nextTile.items.length;

        if(totalItemsNext)
        {
            for(let i = 0; i < totalItemsNext; i++)
            {
                const item = nextTile.items[i];

                if(!item) continue;

                if(!item.baseItem.hasInteraction(InteractionRoller)) continue;

                nextRoller = item;

                break;
            }
        }

        if(nextRoller)
        {
            substractRoller = false;

            if(nextRoller.position.z !== roller.position.z)
            {
                if(Math.abs(nextRoller.position.z - roller.position.z) > 0.1) return;
            }

            const nextTileItems = nextTile.items;

            if(nextTileItems)
            {
                const totalItems = nextTileItems.length;

                if(totalItems)
                {
                    for(let i = 0; i < totalItems; i++)
                    {
                        const item = nextTileItems[i];

                        if(!item) continue;

                        if(item.position.z < nextRoller.position.z) continue;

                        if(item.baseItem.hasInteraction(InteractionRoller))
                        {
                            const itemNextPosition = item.position.getPositionInfront();

                            if(!itemNextPosition) continue;

                            if(itemNextPosition.compare(unit.location.position))
                            {
                                if(nextTile.items.length > 1 || nextTile.units.length > 0) return;
                            }
                        }
                        else
                        {
                            return;
                        }
                    }
                }
            }
        }
        else
        {
            if(!roller.room.map.getValidTile(unit, nextPosition)) return;
        }

        if(substractRoller) nextHeight -= roller.baseItem.stackHeight;

        nextPosition.z = nextHeight;

        return nextPosition;
    }
}