import { BattleBanzaiGame, GameType } from '../../../../room';
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
        super.onClick(unit, item, false);
    }

    public onStep(unit: Unit, item: Item): void
    {
        if(!unit || !item) return;

        const currentRoom = unit.room;

        if(!currentRoom) return;

        const game = <BattleBanzaiGame> currentRoom.gameManager.getActiveGame(GameType.BATTLE_BANZAI);

        if(!game) return;

        if(!game.isStarted) return;

        const player = game.getPlayerForTeam(unit);

        if(!player) return;

        game.markTileForPlayer(player, item.position);
    }
}