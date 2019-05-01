import { Direction, Position } from '../../pathfinder';
import { UnitTeleportEvent } from '../../room';
import { Unit } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { OnClick, OnEnter, OnLeave, OnPickup, OnStep, OnStop, ParseExtraData } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionTeleport extends InteractionDefault implements OnStop, OnLeave, ParseExtraData, OnClick, OnStep, OnEnter, OnPickup
{
    constructor()
    {
        super('teleport');
    }

    public onPickup(user: User, item: Item): void
    {
        if(user && item) item.setExtraData(0);
    }

    public onEnter(unit: Unit, item: Item): void
    {
        super.onEnter(unit, item);
        
        const room = item.room;

        if(room) item.setExtraData(1);
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.onStep(unit, item);
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(unit && item)
        {
            const room = item.room;

            if(room)
            {
                if(item.position.direction === Direction.NORTH)
                {
                    item.position.direction = Direction.EAST;

                    item.save();
                }

                if(!unit.location.position.compare(item.position))
                {
                    if(item.baseItem.canWalk)
                    {
                        unit.location.walkTo(item.position, true, item.position);
                    }
                    else
                    {
                        const positionFront = item.position.getPositionInfront();

                        if(!unit.location.position.compare(positionFront))
                        {
                            if(room.map.getValidTile(unit, positionFront))
                            {
                                unit.location.setClickGoal(positionFront, item);
                                
                                unit.location.walkTo(positionFront, true, item.position);
                            }
                        }
                        else
                        {
                            item.setExtraData(1, false);

                            unit.location.walkTo(item.position, true);
                        }
                    }
                }
                else
                {
                    room.events.next(new UnitTeleportEvent(unit, item));
                }
            }
        }
    }

    public onStop(unit: Unit, item: Item): void
    {
        console.log('trigger stop');
        super.onStop(unit, item);

        if(!unit.location.teleporting)
        {
            const room = item.room;
            
            if(room)
            {
                room.events.next(new UnitTeleportEvent(unit, item));
            }
        }
    }

    public onLeave(unit: Unit, item: Item, positionNext: Position): void
    {
        console.log('leave');
        super.onLeave(unit, item, positionNext);
    }
}