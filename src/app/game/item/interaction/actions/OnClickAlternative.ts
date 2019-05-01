import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface OnClickAlternative
{
    onClickAlternative(unit: Unit, item: Item): void;
}