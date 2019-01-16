import { getManager } from 'typeorm';

import { Emulator } from '../../../Emulator';

import { MessengerRequestEntity, MessengerFriendEntity } from '../../../common';

export class MessengerRequest
{
    constructor(private _entity: MessengerRequestEntity)
    {
        if(!(_entity instanceof MessengerRequestEntity)) throw new Error('invalid_friend_request_info');
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get requestedId(): number
    {
        return this._entity.requestedId;
    }

    public get username(): string
    {
        return this._entity.user.username;
    }

    public get figure(): string
    {
        return this._entity.user.figure;
    }
}