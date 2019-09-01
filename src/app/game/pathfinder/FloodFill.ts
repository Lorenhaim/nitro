import { BanzaiTile, GamePlayer, GameTile, RoomGame } from '../room';
import { Position, standardPoints } from './position';

export class FloodFill
{
    public static getFill(player: GamePlayer, tile: BanzaiTile): GameTile[]
    {
        const closed: GameTile[]    = [];
        const open: GameTile[]      = [];

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
                        const neighbour = <BanzaiTile> neighbours[i];

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

    public static neighbours(game: RoomGame, position: Position, radius: number = 1): GameTile[]
    {
        const tiles: GameTile[] = [];

        const totalPoints = standardPoints.length;

        if(!totalPoints) return null;

        for(let i = 0; i < totalPoints; i++)
        {
            const point = standardPoints[i];

            if(!point) continue;

            let temp: Position = position;

            for(let j = 0; j < radius; j++)
            {
                temp = temp.addPosition(point);

                if(!temp) continue;

                tiles.push(game.getTile(temp));
            }
        }

        if(!tiles.length) return null;

        return tiles;
    }
}