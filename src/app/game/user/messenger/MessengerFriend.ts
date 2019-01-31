export interface MessengerFriend
{
    userId?: number;
    username?: string;
    motto?: string;
    gender?: 'M' | 'F';
    figure?: string;
    online?: boolean;
    categoryId?: number;
    relation?: 0 | 1 | 2 | 3;
}