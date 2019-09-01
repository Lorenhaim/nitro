import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { InteractionDefault } from '../../InteractionDefault';

export class InteractionBattleBanzaiSphere extends InteractionDefault
{
    constructor()
    {
        super('bb_sphere');
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }
}