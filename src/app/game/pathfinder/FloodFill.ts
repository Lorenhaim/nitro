import { BanzaiTile, BattleBanzaiGame, GamePlayer, RoomGame } from '../room';
import { Position, standardPoints } from './position';

export class FloodFill
{
    public static getFill(player: GamePlayer, tile: BanzaiTile): BanzaiTile[]
    {
        const closed: BanzaiTile[]    = [];
        const open: BanzaiTile[]      = [];

        open.push(tile);

        while(open.length)
        {
            const currentTile = open.pop();

            if(!currentTile) continue;

            const neighbours = FloodFill.neighbours(player.team.game, currentTile.position);

            if(neighbours)
            {
                const totalNeighbours = neighbours.length;

                if(totalNeighbours)
                {
                    for(let i = 0; i < totalNeighbours; i++)
                    {
                        const neighbour = neighbours[i];

                        if(!neighbour) return null;

                        if(neighbour.isDisabled) return null;

                        if((neighbour.color !== <any> player.team.color || !neighbour.isLocked) && closed.indexOf(neighbour) === -1 && open.indexOf(neighbour) === -1) open.unshift(neighbour);
                    }
                }
            }

            closed.push(currentTile);
        }

        return closed;
    }

    public static neighbours(game: RoomGame, position: Position): BanzaiTile[]
    {
        if(!(game instanceof BattleBanzaiGame)) return null;

        const tiles: BanzaiTile[] = [];

        const totalPoints = standardPoints.length;

        if(!totalPoints) return null;

        for(let i = 0; i < totalPoints; i++)
        {
            const point = standardPoints[i];

            if(!point) continue;

            const temp = position.addPosition(point);

            if(!temp) continue;

            tiles.push(game.getTile(temp));
        }

        if(!tiles.length) return null;

        return tiles;
    }
}