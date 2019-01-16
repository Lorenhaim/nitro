import { getManager } from 'typeorm';

import { Emulator } from '../../../Emulator';

import { MessengerFriendRequestEntity, MessengerFriendEntity } from '../../../common';

export class MessengerFriendRequest
{
    constructor(private _entity: MessengerFriendRequestEntity)
    {
        if(!(_entity instanceof MessengerFriendRequestEntity)) throw new Error('invalid_friend_request_info');
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