import { User } from '../../../game';
import { PluginEvent } from '../PluginEvent';

export abstract class UserEvent extends PluginEvent
{
    private _user: User;

    constructor(user: User)
    {
        if(!(user instanceof User)) throw new Error('invalid_user');

        super();

        this._user = user;
    }

    public get user(): User
    {
        return this._user;
    }
}