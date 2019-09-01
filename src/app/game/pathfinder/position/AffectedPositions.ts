import { Item } from '../../item';
import { Direction } from './Direction';
import { Position } from './Position';

export class AffectedPositions
{
    public static getPositions(item: Item, position: Position = null): Position[]
    {
        if(!item) return null;
        
        position = position || item.position;
            
        const positions: Position[] = [];

        let length  = item.baseItem.length;
        let width   = item.baseItem.width;

        if(position.direction === Direction.EAST || position.direction === Direction.WEST) [length, width] = [width, length];

        for(let tempX = position.x; tempX < position.x + width; tempX++)
        {
            for(let tempY = position.y; tempY < position.y + length; tempY++) positions.push(new Position(tempX, tempY));
        }

        if(!positions.length) return null;

        return positions;
    }

    public static getPillowPositions(item: Item, position: Position = null): Position[]
    {
        if(!item) return null;
        
        position = position || item.position;
            
        const positions: Position[] = [];

        positions.push(new Position(item.position.x, item.position.y));

        if(item.baseItem.width !== 2) return positions;

        const x = position.direction === 0 ? position.x + 1 : position.x;
        const y = position.direction === 2 ? position.y + 1 : position.y;

        positions.push(new Position(x, y));

        return positions;
    }
}