import { BattleBanzaiGame } from '../../../../room';
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

        const currentRoom = unit.room;

        if(!currentRoom) return;

        const game = currentRoom.gameManager.getActiveGame(BattleBanzaiGame);

        if(!game) return;

        if(!(game instanceof BattleBanzaiGame)) return;

        if(!game.isStarted) return;

        const player = game.getPlayerForTeam(unit);

        if(!player) return;

        game.markTileForPlayer(player, item.position);
    }
}