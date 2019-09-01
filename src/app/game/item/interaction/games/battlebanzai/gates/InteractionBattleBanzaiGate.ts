import { GameTeamColor, GameType } from '../../../../../room';
import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnClick } from '../../../actions';
import { InteractionDefault } from '../../../InteractionDefault';

export class InteractionBattleBanzaiGate extends InteractionDefault implements OnClick
{
    constructor(name: string = null)
    {
        super(name || 'bb_g');
    }

    protected setTeam(unit: Unit, color: GameTeamColor): void
    {
        if(!unit || color === null) return;

        const currentRoom = unit.room;

        if(!currentRoom) return;

        const game = currentRoom.gameManager.getGame(GameType.BATTLE_BANZAI);

        if(!game) return;

        const team = game.getTeam(color);

        if(!team) return;

        team.addPlayer(unit);
    }

    public onClick(unit: Unit, item: Item): void
    {
        super.onClick(unit, item, false);
    }
}