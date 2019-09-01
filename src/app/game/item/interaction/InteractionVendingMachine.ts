import { Direction } from '../../pathfinder';
import { Unit } from '../../unit';
import { Item } from '../Item';
import { OnClick } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionVendingMachine extends InteractionDefault implements OnClick
{
    constructor()
    {
        super('vending_machine');
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

        if(item.extraData === '1') return;

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
            if(unit.location.position.direction !== item.position.directionOpposite)
            {
                unit.location.position.setDirection(item.position.directionOpposite);

                unit.needsUpdate = true;
            }

            const handItem = item.baseItem.getRandomVending();

            if(!handItem) return;

            item.setExtraData(1);
                
            unit.location.hand(handItem);
    
            setTimeout(() => item.setExtraData(0), 1000);
        }

        super.onClick(unit, item, false);
    }
}