import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnStep
{
    onStep(unit: Unit, item: Item): void;
}