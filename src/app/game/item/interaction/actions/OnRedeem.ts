import { User } from '../../../user';
import { Item } from '../../Item';

export interface OnRedeem
{
    onRedeem(user: User, item: Item): Promise<void>;
}