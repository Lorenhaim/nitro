import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnClick } from '../../../actions';
import { InteractionDefault } from '../../../InteractionDefault';

export class InteractionBattleBanzaiScoreboard extends InteractionDefault implements OnClick
{
    constructor(name: string = null)
    {
        super(name || 'bb_s');
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }
}