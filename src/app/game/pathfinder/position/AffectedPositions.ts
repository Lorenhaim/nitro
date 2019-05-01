import { Item } from '../../item';
import { Direction } from './Direction';
import { Position } from './Position';

export class AffectedPositions
{
    public static getPositions(item: Item, position: Position = null): Position[]
    {
        if(item)
        {
            position = position || item.position;
            
            const positions: Position[] = [];

            let length  = item.baseItem.length;
            let width   = item.baseItem.width;

            //position.direction = position.direction % 8; // ??

            if(position.direction === Direction.EAST || position.direction === Direction.WEST) [length, width] = [width, length];

            for(let tempX = position.x; tempX < position.x + width; tempX++)
            {
                for(let tempY = position.y; tempY < position.y + length; tempY++) positions.push(new Position(tempX, tempY));
            }

            return positions;
        }

        return null;
    }

    public static getPillowPositions(item: Item): Position[]
    {
        if(item)
        {
            const positions: Position[] = [];

            positions.push(new Position(item.position.x, item.position.y));

            if(item.baseItem.width === 2)
            {
                if(item.position.direction === Direction.NORTH) positions.push(new Position(item.position.x + 1, item.position.y));
                else if(item.position.direction === Direction.EAST) positions.push(new Position(item.position.x, item.position.y + 1));
            }

            return positions;
        }

        return null;
    }

    public static getFeetPositions(item: Item): Position[]
    {
        if(item)
        {
            const positions: Position[] = [];

            positions.push(new Position(item.position.x, item.position.y + item.baseItem.length - 1));

            if(item.baseItem.width === 2)
            {
                if(item.position.direction === Direction.NORTH) positions.push(new Position(item.position.x + 1, item.position.y + item.baseItem.length - 1));
                else if(item.position.direction === Direction.EAST) positions.push(new Position(item.position.x + item.baseItem.length - 1, item.position.y + 1));
            }

            return positions;
        }

        return null;
    }
}