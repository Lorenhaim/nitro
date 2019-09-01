import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnDiceClose
{
    onDiceClose(unit: Unit, item: Item): void;
}