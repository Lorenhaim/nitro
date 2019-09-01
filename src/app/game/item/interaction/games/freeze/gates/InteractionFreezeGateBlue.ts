import { GameTeamColor } from '../../../../../room';
import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnStep } from '../../../actions';
import { InteractionFreezeGate } from './InteractionFreezeGate';

export class InteractionFreezeGateBlue extends InteractionFreezeGate implements OnStep
{
    constructor()
    {
        super('es_g_blue');
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.setTeam(unit, GameTeamColor.BLUE);
    }
}