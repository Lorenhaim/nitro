import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnClick } from '../../../actions';
import { InteractionDefault } from '../../../InteractionDefault';

export class InteractionFreezeScoreboard extends InteractionDefault implements OnClick
{
    constructor(name: string = null)
    {
        super(name || 'es_s');
    }

    public onClick(unit: Unit, item: Item): void
    {
        return;
    }
}