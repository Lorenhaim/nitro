import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { OnClick, OnStep } from '../../actions';
import { InteractionDefault } from '../../InteractionDefault';

export class InteractionBattleBanzaiTile extends InteractionDefault implements OnClick, OnStep
{
    constructor()
    {
        super('bb_tile');
    }

    public onClick(unit: Unit, item: Item): void
    {        
        return;
    }

    public onStep(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        item.setExtraData(1);
        
        return;
    }
}