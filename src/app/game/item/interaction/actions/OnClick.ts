import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnClick
{
    onClick(unit: Unit, item: Item): void;
}