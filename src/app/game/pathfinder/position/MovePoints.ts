import { Position } from './Position';

export const standardPoints: Position[] = [
    new Position(0, -1),
    new Position(1, 0),
    new Position(0, 1),
    new Position(-1, 0)
];

export const diagonalPoints: Position[] = [
    new Position(1, -1),
    new Position(-1, 1),
    new Position(1, 1),
    new Position(-1, -1)
];

export const movePoints: Position[] = [ ...standardPoints, ...diagonalPoints ];