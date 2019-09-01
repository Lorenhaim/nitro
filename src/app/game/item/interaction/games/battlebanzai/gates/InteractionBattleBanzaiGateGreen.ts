import { GameTeamColor } from '../../../../../room';
import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnStep } from '../../../actions';
import { InteractionBattleBanzaiGate } from './InteractionBattleBanzaiGate';

export class InteractionBattleBanzaiGateGreen extends InteractionBattleBanzaiGate implements OnStep
{
    constructor()
    {
        super('bb_g_green');
    }

    public onStep(unit: Unit, item: Item): void
    {
        super.setTeam(unit, GameTeamColor.GREEN);
    }
}