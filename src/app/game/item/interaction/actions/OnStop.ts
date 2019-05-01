import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnStop
{
    onStop(unit: Unit, item: Item): void;
}