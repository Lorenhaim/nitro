export const enum Direction
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

const directionNames = [];

directionNames['0'] = 'NORTH';
directionNames['1'] = 'NORTH_EAST';
directionNames['2'] = 'EAST';
directionNames['3'] = 'SOUTH_EAST';
directionNames['4'] = 'SOUTH';
directionNames['5'] = 'SOUTH_WEST';
directionNames['6'] = 'WEST';
directionNames['7'] = 'NORTH_WEST';

export const DirectionNames = directionNames;