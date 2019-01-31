import { MessengerFriend } from './MessengerFriend';

export interface MessengerUpdate
{
    type: 'add' | 'update' | 'remove';
    friend: MessengerFriend;
}