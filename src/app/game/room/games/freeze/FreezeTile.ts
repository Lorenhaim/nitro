import { InteractionFreezeTile, Item } from '../../../item';
import { FloodFill } from '../../../pathfinder';
import { GameTile } from '../GameTile';
import { GamePlayer } from '../teams';

export class FreezeTile extends GameTile
{
    constructor(item: Item)
    {
        if(!(item instanceof Item)) throw new Error('invalid_item');

        if(!(item.baseItem.interaction instanceof InteractionFreezeTile)) throw new Error('invalid_interaction');

        super(item);
    }

    public resetTile(): void
    {
        this.item.setExtraData(0);
    }

    private processExplosion(player: GamePlayer, checkNeighbours: boolean = false): void
    {
        if(!player) return;

        this.item.setExtraData(11000);

        if(checkNeighbours) this.explodeNeighbours(player, 3);

        this.freezeUnits(player);

        setTimeout(() => this.finishExplosion(), 3000);
    }

    private freezeUnits(player: GamePlayer): void
    {
        if(!player) return;

        const tile = this.item.getTile();

        if(!tile) return;

        const totalUnits = tile.units.length;

        for(let i = 0; i < totalUnits; i++)
        {
            const unit = tile.units[i];

            if(!unit) continue;

            const activePlayer = this.item.room.gameManager.getPlayer(unit);

            if(!activePlayer) continue;

            activePlayer.freeze();

            if(activePlayer === player) continue;

            player.adjustScore(1);
        }
    }

    private finishExplosion(): void
    {
        this.resetTile();
    }

    public markTile(player: GamePlayer): void
    {
        if(!player) return;

        const radius = 3;

        this.item.setExtraData(radius * 1000);

        setTimeout(() => this.processExplosion(player, true), 3000);
    }

    private explodeNeighbours(player: GamePlayer, radius: number = 1): void
    {
        if(!player) return;

        const neighbours = FloodFill.neighbours(player.team.game, this.position, radius);

        if(!neighbours) return;
        
        const totalNeighbours = neighbours.length;

        if(!totalNeighbours) return;
        
        for(let i = 0; i < totalNeighbours; i++)
        {
            const neighbour = <FreezeTile> neighbours[i];

            if(!neighbour) continue;

            neighbour.processExplosion(player, false);
        }
    }
}