import { InteractionBattleBanzaiTeleport, Item } from '../../../item';
import { Position } from '../../../pathfinder';
import { GamePlayer } from '../teams';
import { BattleBanzaiGame } from './BattleBanzaiGame';

export class BanzaiTeleport
{
    private _game: BattleBanzaiGame;
    private _item: Item;

    constructor(game: BattleBanzaiGame, item: Item)
    {
        if(!(game instanceof BattleBanzaiGame)) throw new Error('invalid_game');

        if(!(item instanceof Item)) throw new Error('invalid_item');

        if(!(item.baseItem.interaction instanceof InteractionBattleBanzaiTeleport)) throw new Error('invalid_interaction');

        this._game  = game;
        this._item  = item;
    }

    public teleportPlayer(player: GamePlayer, next: BanzaiTeleport): void
    {
        if(!player || !player.unit || !next) return;

        const goalTile = this._game.room.map.getValidTile(player.unit, next.position, true);

        if(!goalTile) return;

        player.unit.canLocate = false;

        player.unit.location.stopWalking();

        this._item.setExtraData(1);
        next.item.setExtraData(1);

        setTimeout(() => next.receiveTeleport(player, this), 300);
    }

    public receiveTeleport(player: GamePlayer, previous: BanzaiTeleport): void
    {
        if(!player || !player.unit || !previous) return;

        const goalTile = this._game.room.map.getValidTile(player.unit, this.position, true);

        if(!goalTile)
        {
            player.unit.canLocate = true;

            previous.item.setExtraData(0);

            return;
        }

        if(!player.unit.location.position.compare(previous.position))
        {
            player.unit.canLocate = true;
            
            previous.item.setExtraData(0);
            this._item.setExtraData(0);

            return;
        }

        player.unit.location.position.x = this._item.position.x + 0;
        player.unit.location.position.y = this._item.position.y + 0;

        player.unit.needsUpdate = true;

        previous.item.setExtraData(0);
        this._item.setExtraData(0);

        player.unit.canLocate = true;
    }
    
    public get item(): Item
    {
        return this._item;
    }

    public get position(): Position
    {
        return this._item.position;
    }
}