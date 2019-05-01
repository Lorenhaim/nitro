import { Item } from '../../Item';

export interface OnTriggered
{
    onTriggered(item: Item): void;
}