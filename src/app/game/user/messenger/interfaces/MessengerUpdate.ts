import { MessengerFriend } from '../MessengerFriend';
import { MessengerUpdateType } from './MessengerUpdateType';

export interface MessengerUpdate
{
    type: MessengerUpdateType;
    friendId: number;
    friend?: MessengerFriend;
}