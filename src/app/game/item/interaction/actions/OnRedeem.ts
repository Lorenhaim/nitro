import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnRedeem
{
    onRedeem(unit: Unit, item: Item): Promise<void>;
}