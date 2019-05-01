import { Unit } from '../../unit';
import { Item } from '../Item';
import { OnClick } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionMultiHeight extends InteractionDefault implements OnClick
{
    constructor()
    {
        super('multi_height');
    }

    public onClick(unit: Unit, item: Item)
    {
        super.onClick(unit, item);

        const room = item.room;

        if(!room) return;

        room.map.updatePositions(item.position);
    }
}