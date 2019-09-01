import { BattleBanzaiGame, GameType } from '../../../../room';
import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { InteractionDefault } from '../../InteractionDefault';

export class InteractionBattleBanzaiTeleport extends InteractionDefault
{
    constructor()
    {
        super('bb_tp');
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

        game.triggerTeleport(player, item.position);
    }
}