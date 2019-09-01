import { Unit } from '../../unit';
import { Item } from '../Item';
import { OnClick } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionStackHelper extends InteractionDefault implements OnClick
{
    constructor()
    {
        super('stack_helper');
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }
}