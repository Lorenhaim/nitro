import { FreezeGame, GameType } from '../../../../room';
import { Unit } from '../../../../unit';
import { Item } from '../../../Item';
import { OnClick } from '../../actions';
import { InteractionDefault } from '../../InteractionDefault';

export class InteractionFreezeTile extends InteractionDefault implements OnClick
{
    constructor()
    {
        super('es_tile');
    }

    public onClick(unit: Unit, item: Item): void
    {        
        if(!unit || !item) return;

        const currentRoom = unit.room;

        if(!currentRoom) return;

        if(!unit.location.position.compare(item.position)) return;

        const game = <FreezeGame> currentRoom.gameManager.getActiveGame(GameType.FREEZE);

        if(!game) return;

        if(!game.isStarted) return;

        const player = game.getPlayerForTeam(unit);

        if(!player) return;

        game.markTileForPlayer(player, item.position);
    }
}