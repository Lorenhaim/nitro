import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnEnter
{
    onEnter(unit: Unit, item: Item): void;
}