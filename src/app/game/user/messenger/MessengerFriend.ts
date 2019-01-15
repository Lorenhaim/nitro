import { getManager, RelationCount } from 'typeorm';

import { MessengerFriendEntity, UserEntity } from '../../../common';

export class MessengerFriend
{
    constructor(private _entity: MessengerFriendEntity)
    {
        if(!(_entity instanceof MessengerFriendEntity)) throw new Error('invalid_friend_info');
    }

    public update(_entity: UserEntity)
    {
        if(!(_entity instanceof UserEntity)) throw new Error('invalid_friend_info');
    }

    public get userId(): number
    {
        return this._entity.friendId;
    }

    public get username(): string
    {
        return this._entity.friend.username;
    }

    public get motto(): string
    {
        return this._entity.friend.motto;
    }

    public get gender(): 'M' | 'F'
    {
        return this._entity.friend.gender;
    }

    public get figure(): string
    {
        return this._entity.friend.figure;
    }

    public get online(): boolean
    {
        return this._entity.friend.online === '1';
    }

    public get relation()
    {
        return this._entity.relation;
    }
}