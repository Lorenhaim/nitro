import { User } from '../../../game';
import { UserEvent } from './UserEvent';

export class UserLoginEvent extends UserEvent
{
    constructor(user: User)
    {
        super(user);
    }
}