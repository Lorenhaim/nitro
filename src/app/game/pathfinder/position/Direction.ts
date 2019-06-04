export enum Direction
{
    NORTH       = 0,
    NORTH_EAST  = 1,
    EAST        = 2,
    SOUTH_EAST  = 3,
    SOUTH       = 4,
    SOUTH_WEST  = 5,
    WEST        = 6,
    NORTH_WEST  = 7
}

export enum DirectionSimple
{
    NORTH       = 0,
    EAST        = 2,
    SOUTH       = 4,
    WEST        = 6
}

const directionNames = [];

directionNames[Direction.NORTH] = 'NORTH';
directionNames[Direction.NORTH_EAST] = 'NORTH_EAST';
directionNames[Direction.EAST] = 'EAST';
directionNames[Direction.SOUTH_EAST] = 'SOUTH_EAST';
directionNames[Direction.SOUTH] = 'SOUTH';
directionNames[Direction.SOUTH_WEST] = 'SOUTH_WEST';
directionNames[Direction.WEST] = 'WEST';
directionNames[Direction.NORTH_WEST] = 'NORTH_WEST';

export const DirectionNames = directionNames;