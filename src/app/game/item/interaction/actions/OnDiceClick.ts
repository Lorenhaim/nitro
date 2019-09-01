import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnDiceClick
{
    onDiceClick(unit: Unit, item: Item): void;
}