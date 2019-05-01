import { User } from '../../../user';
import { Item } from '../../Item';

export interface OnMove
{
    onMove(user: User, item: Item): void;
}