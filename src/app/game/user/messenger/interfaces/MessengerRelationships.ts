import { MessengerFriend } from '../MessengerFriend';

export interface MessengerRelationships
{
    lovers: MessengerFriend[],
    friends: MessengerFriend[],
    haters: MessengerFriend[]
}