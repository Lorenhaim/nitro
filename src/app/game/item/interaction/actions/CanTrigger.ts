import { Item } from '../../Item';

export interface CanTrigger
{
    canTrigger(item: Item, ...args: any[]): boolean;
}