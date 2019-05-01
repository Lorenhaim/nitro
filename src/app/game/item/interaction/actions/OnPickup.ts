import { User } from '../../../user';
import { Item } from '../../Item';

export interface OnPickup
{
    onPickup(user: User, item: Item): void;
}