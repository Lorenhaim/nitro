import { GameTeamColor } from '../../../../../room';
import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnStep } from '../../../actions';
import { InteractionBattleBanzaiGate } from './InteractionBattleBanzaiGate';

export class InteractionBattleBanzaiGateYellow extends InteractionBattleBanzaiGate implements OnStep
{
    constructor()
    {
        super('bb_g_yellow');
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.setTeam(unit, GameTeamColor.YELLOW);
    }
}