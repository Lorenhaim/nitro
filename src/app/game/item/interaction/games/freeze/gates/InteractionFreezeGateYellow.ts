import { GameTeamColor } from '../../../../../room';
import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnStep } from '../../../actions';
import { InteractionFreezeGate } from './InteractionFreezeGate';

export class InteractionFreezeGateYellow extends InteractionFreezeGate implements OnStep
{
    constructor()
    {
        super('es_g_yellow');
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.setTeam(unit, GameTeamColor.YELLOW);
    }
}