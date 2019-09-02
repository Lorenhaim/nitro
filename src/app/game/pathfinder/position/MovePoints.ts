import { Position } from './Position';

export class MovePoints
{
    public static STANDARD_POINTS: Position[] = [
        new Position(0, -1),
        new Position(1, 0),
        new Position(0, 1),
        new Position(-1, 0)
    ];

    public static DIAGONAL_POINTS: Position[] = [
        new Position(1, -1),
        new Position(-1, 1),
        new Position(1, 1),
        new Position(-1, -1)
    ];

    public static MOVE_POINTS: Position[] = [ ...MovePoints.STANDARD_POINTS, ...MovePoints.DIAGONAL_POINTS ];
}