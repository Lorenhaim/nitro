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
        if(unit && item)
        {
            if(item.extraData === '0')
            {
                const room = item.room;

                if(room)
                {
                    const positionInfront = item.position.getPositionInfront();

                    positionInfront.setDirection(item.position.directionOpposite);

                    if(!unit.location.position.compare(positionInfront))
                    {
                        if(!room.map.getValidTile(unit, positionInfront)) return;

                        unit.location.setClickGoal(positionInfront, item);

                        unit.location.walkTo(positionInfront, false, item.position);

                        return;
                    }

                    if(unit.location.position.direction !== positionInfront.direction)
                    {
                        unit.location.position.setDirection(positionInfront.direction);

                        unit.needsUpdate = true;
                    }

                    const handItem = item.baseItem.getRandomVending();

                    if(handItem)
                    {
                        item.setExtraData(1);
                        
                        unit.location.hand(handItem);

                        setTimeout(() => item.setExtraData(0), 1000);
                    }
                }
            }
        }
    }
}