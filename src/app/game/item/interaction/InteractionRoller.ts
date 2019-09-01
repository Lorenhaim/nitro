import { Unit } from '../../unit';
import { Item } from '../Item';
import { OnClick } from './actions';
import { InteractionDefault } from './InteractionDefault';

export class InteractionRoller extends InteractionDefault implements OnClick
{
    constructor()
    {
        super('roller');
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }
}