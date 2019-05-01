import { Position } from '../../../pathfinder';
import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnLeave
{
    onLeave(unit: Unit, item: Item, positionNext: Position): void;
}