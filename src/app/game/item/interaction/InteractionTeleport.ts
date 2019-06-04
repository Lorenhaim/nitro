import { Direction, Position } from '../../pathfinder';
import { Unit, UnitTeleporting } from '../../unit';
import { User } from '../../user';
import { Item } from '../Item';
import { BeforeStep, OnClick, OnEnter, OnLeave, OnPickup, OnStep, OnStop, ParseExtraData } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionTeleport extends InteractionDefault implements OnStop, OnLeave, ParseExtraData, OnClick, OnStep, OnEnter, OnPickup, BeforeStep
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
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.onStep(unit, item);
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;
        
        const room = item.room;

        if(!room) return;
        
        if(item.position.direction === Direction.NORTH)
        {
            item.position.direction = Direction.EAST;

            item.save();
        }

        if(!unit.location.position.compare(item.position))
        {
            if(item.isItemOpen) return unit.location.walkTo(item.position, false);

            const tileFront = room.map.getValidTile(unit, item.position.getPositionInfront());

            if(!tileFront) return;

            if(!unit.location.position.compare(tileFront.position))
            {
                unit.location.setGoalAction(() =>
                {
                    if(unit.location.positionGoal.compare(tileFront.position)) this.onClick(unit, item);
                });

                return unit.location.walkTo(tileFront.position, false);
            }
            else
            {
                item.setExtraData(1, false);

                setTimeout(() =>
                {
                    if(!unit.location.position.compare(tileFront.position)) return;

                    this.onClick(unit, item)
                }, 300);
            }
        }
    }

    public beforeStep(unit: Unit, item: Item): void
    {
        super.beforeStep(unit, item);

        unit.canLocate = false;

        item.setExtraData(1);
    }

    public onStop(unit: Unit, item: Item): void
    {
        super.onStop(unit, item);

        if(!unit || !item) return;
        
        const room = item.room;

        if(!room) return;

        unit.location.teleporting = new UnitTeleporting(unit, item);
    }

    public onLeave(unit: Unit, item: Item, positionNext: Position): void
    {
        super.onLeave(unit, item, positionNext);
    }
}