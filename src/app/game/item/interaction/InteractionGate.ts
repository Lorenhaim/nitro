import { Unit } from '../../unit';
import { Item } from '../Item';
import { OnClick } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionGate extends InteractionDefault implements OnClick
{
    constructor()
    {
        super('gate');
    }

    public onClick(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;
        
        const room = item.room;

        if(!room) return;
        
        const tile = item.getTile();

        if(!tile) return;

        if(tile.units.length) return;

        if(!unit.hasRights()) return;
        
        item.setExtraData(item.extraData === '1' ? 0 : 1);
    }
}