import { GameTeamColor, GameType } from '../../../../../room';
import { Unit } from '../../../../../unit';
import { Item } from '../../../../Item';
import { OnClick } from '../../../actions';
import { InteractionDefault } from '../../../InteractionDefault';

export class InteractionFreezeGate extends InteractionDefault implements OnClick
{
    constructor(name: string = null)
    {
        super(name || 'es_g');
    }

    protected setTeam(unit: Unit, color: GameTeamColor): void
    {
        if(!unit || color === null) return;

        const currentRoom = unit.room;

        if(!currentRoom) return;

        const game = currentRoom.gameManager.getGame(GameType.FREEZE);

        if(!game) return;

        const team = game.getTeam(color);

        if(!team) return;

        team.addPlayer(unit);
    }

    public onClick(unit: Unit, item: Item): void
    {
        return;
    }
}