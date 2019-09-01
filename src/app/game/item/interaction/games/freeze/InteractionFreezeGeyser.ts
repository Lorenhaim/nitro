import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { OnClick } from '../../actions';
import { InteractionGate } from '../../InteractionGate';

export class InteractionFreezeGeyser extends InteractionGate implements OnClick
{
    constructor()
    {
        super('es_geyser');
    }

    public onClick(unit: Unit, item: Item): void
    {        
        return;
    }
}