import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnClick } from '../../../actions';
import { InteractionDefault } from '../../../InteractionDefault';

export class InteractionBattleBanzaiGate extends InteractionDefault implements OnClick
{
    constructor(name: string = null)
    {
        super(name || 'bb_gate');
    }

    public onClick(unit: Unit, item: Item): void
    {
        
    }
}