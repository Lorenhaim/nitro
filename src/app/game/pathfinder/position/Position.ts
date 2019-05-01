import { Direction } from './Direction';

export class Position
{
    private _x: number;
    private _y: number;
    private _z: number;

    private _direction: Direction;
    private _headDirection: Direction;

    constructor(x: number, y: number, z?: number, direction?: Direction, headDirection?: Direction)
    {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0.00;

        this._direction     = direction || Direction.NORTH;
        this._headDirection = headDirection || Direction.NORTH;
    }

    public addPosition(position: Position): Position
    {
        const copy = this.copy();

        copy.x += position.x;
        copy.y += position.y;
        copy.z += position.z;

        return copy;
    }

    public subtractPosition(position: Position): Position
    {
        const copy = this.copy();

        copy.x -= position.x;
        copy.y -= position.y;
        copy.z -= position.z;

        return copy;
    }

    public getPositionInfront(): Position
    {
        const copy = this.copy();

        switch(copy.direction)
        {
            case Direction.NORTH:
                copy.y--;
                break;
            case Direction.NORTH_EAST:
                copy.x++;
                copy.y--;
                break;
            case Direction.EAST:
                copy.x++;
                break;
            case Direction.SOUTH_EAST:
                copy.x++;
                copy.y++;
                break;
            case Direction.SOUTH:
                copy.y++;
                break;
            case Direction.SOUTH_WEST:
                copy.x--;
                copy.y++;
                break;
            case Direction.WEST:
                copy.x--;
                break;
            case Direction.NORTH_WEST:
                copy.x--;
                copy.y--;
                break;
            default: break;
        }

        return copy;
    }

    public getPositionBehind(): Position
    {
        const copy = this.copy();

        switch(copy.direction)
        {
            case Direction.NORTH:
                copy.y++;
                break;
            case Direction.NORTH_EAST:
                copy.x--;
                copy.y++;
                break;
            case Direction.EAST:
                copy.x--;
                break;
            case Direction.SOUTH_EAST:
                copy.x--;
                copy.y--;
                break;
            case Direction.SOUTH:
                copy.y--;
                break;
            case Direction.SOUTH_WEST:
                copy.x++;
                copy.y--;
                break;
            case Direction.WEST:
                copy.x++;
                break;
            case Direction.NORTH_WEST:
                copy.x++;
                copy.y++;
                break;
            default: break;
        }

        return copy;
    }

    public getPositionLeft(): Position
    {
        const copy = this.copy();

        switch(copy.direction)
        {
            case Direction.NORTH:
                copy.x--;
                break;
            case Direction.NORTH_EAST:
                copy.x--;
                copy.y--;
                break;
            case Direction.EAST:
                copy.y--;
                break;
            case Direction.SOUTH_EAST:
                copy.x++;
                copy.y--;
                break;
            case Direction.SOUTH:
                copy.x++;
                break;
            case Direction.SOUTH_WEST:
                copy.x++;
                copy.y++;
                break;
            case Direction.WEST:
                copy.y++;
                break;
            case Direction.NORTH_WEST:
                copy.x--;
                copy.y++;
                break;
            default: break;
        }

        return copy;
    }

    public getPositionRight(): Position
    {
        const copy = this.copy();

        switch(copy.direction)
        {
            case Direction.NORTH:
                copy.x++;
                break;
            case Direction.NORTH_EAST:
                copy.x++;
                copy.y++;
                break;
            case Direction.EAST:
                copy.y++;
                break;
            case Direction.SOUTH_EAST:
                copy.x--;
                copy.y++;
                break;
            case Direction.SOUTH:
                copy.x--;
                break;
            case Direction.SOUTH_WEST:
                copy.x--;
                copy.y--;
                break;
            case Direction.WEST:
                copy.y--;
                break;
            case Direction.NORTH_WEST:
                copy.x++;
                copy.y--;
                break;
            default: break;
        }

        return copy;
    }

    public getDistanceAround(position: Position): number
    {
        const copy = this.copy();

        copy.x -= position.x;
        copy.y -= position.y;

        return (copy.x * copy.x) + (copy.y * copy.y);
    }

    public getPositionsAround(radius: number = 1): Position[]
    {
        const copy      = this.copy();
        const positions = [];

        radius = radius * 2;

        for(let x = copy.x - radius; x <= copy.x + radius; x++)
        {
            for(let y = copy.y - radius; y <= copy.y + radius; y++)
            {
                const position = new Position(x, y);

                if(position)
                {
                    if(this.compare(position)) continue;

                    const distance = position.getDistanceAround(this);

                    if(distance <= radius) positions.push(new Position(x, y));
                }
            }
        }

        return positions;
    }

    public isNear(position: Position, radius: number = 1): boolean
    {
        if(position && radius)
        {
            const positions = this.getPositionsAround(radius);

            if(positions)
            {
                const totalPositions = positions.length;

                if(totalPositions)
                {
                    for(let i = 0; i < totalPositions; i++)
                    {
                        const nearPosition = positions[i];

                        if(nearPosition.compare(position)) return true;
                    }
                }
            }
        }

        return false;
    }

    public copy(): Position
    {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }
    
    public compare(position: Position): boolean
    {
        return position !== null && this._x === position.x && this._y === position.y;
    }

    public compareStrict(position: Position): boolean
    {
        return position !== null && this._x === position.x && this._y === position.y && this._direction === position.direction;
    }

    public setDirection(direction: Direction): void
    {
        this._direction     = direction;
        this._headDirection = direction;
    }

    public calculateHumanDirection(position: Position): Direction
    {
        if(position)
        {
            if(this._x > position.x && this._y > position.y)        return Direction.NORTH_WEST;
            else if(this._x < position.x && this._y < position.y)   return Direction.SOUTH_EAST;
            else if(this._x > position.x && this._y < position.y)   return Direction.SOUTH_WEST;
            else if(this._x < position.x && this._y > position.y)   return Direction.NORTH_EAST;
            else if(this._x > position.x)                           return Direction.WEST;
            else if(this._x < position.x)                           return Direction.EAST;
            else if(this._y < position.y)                           return Direction.SOUTH;
        }

        return Direction.NORTH;
    }

    public calculateSitDirection(): Direction
    {
        if(this._direction === Direction.NORTH_EAST)        return Direction.NORTH;
        else if(this._direction === Direction.NORTH_WEST)   return Direction.WEST;
        else if(this._direction === Direction.SOUTH_EAST)   return Direction.EAST;
        else if(this._direction === Direction.SOUTH_WEST)   return Direction.SOUTH;
        
        return this._direction;
    }

    public calculateWalkDirection(position: Position): Direction
    {
        if(position)
        {
            if(this._x === position.x)
            {
                if(this._y < position.y) return Direction.SOUTH;
                else return Direction.NORTH;
            }

            else if(this._x > position.x)
            {
                if(this._y === position.y) return Direction.WEST;
                else if(this._y < position.y) return Direction.SOUTH_WEST;
                else return Direction.NORTH_WEST
            }

            else if(this._y === position.y) return Direction.EAST;
            else if(this._y < position.y) return Direction.SOUTH_EAST;
        }

        return Direction.NORTH_EAST;
    }

    public calculateHeadDirection(position: Position): Direction
    {
        if(position)
        {
            const difference = this._direction - this.calculateHumanDirection(position);

            if((this._direction % 2) === 0)
            {
                if(difference > 0) return this._direction - 1;
                else if(difference < 0) return this._direction + 1;
            }
        }
        
        return this._direction;
    }

    public get x(): number
    {
        return this._x;
    }

    public set x(x: number)
    {
        this._x = x || 0;
    }

    public get y(): number
    {
        return this._y;
    }

    public set y(y: number)
    {
        this._y = y || 0;
    }

    public get z(): number
    {
        return this._z;
    }

    public set z(z: number)
    {
        this._z = z || 0.00;
    }

    public get direction(): Direction
    {
        return this._direction;
    }

    public set direction(direction: Direction)
    {
        this._direction = direction;
    }

    public get directionOpposite(): Direction
    {
        switch(this._direction)
        {
            case Direction.NORTH:       return Direction.SOUTH;
            case Direction.SOUTH:       return Direction.NORTH;
            case Direction.EAST:        return Direction.WEST;
            case Direction.WEST:        return Direction.EAST;
            case Direction.NORTH_EAST:  return Direction.SOUTH_WEST;
            case Direction.NORTH_WEST:  return Direction.SOUTH_EAST;
            case Direction.SOUTH_EAST:  return Direction.NORTH_WEST;
            case Direction.SOUTH_WEST:  return Direction.NORTH_EAST;
        }
    }

    public get headDirection(): Direction
    {
        return this._headDirection;
    }

    public set headDirection(direction: Direction)
    {
        this._headDirection = direction;
    }
}