import { Unit } from '../../../unit';
import { Item } from '../../Item';

export interface BeforeStep
{
    beforeStep(unit: Unit, item: Item): void;
}