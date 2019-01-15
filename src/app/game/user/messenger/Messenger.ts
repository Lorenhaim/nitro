import { getManager } from 'typeorm';

import { Emulator } from '../../../Emulator';
import { Logger, MessengerFriendEntity, MessengerFriendRequestEntity, UserEntity } from '../../../common';

import { User } from '../User';
import { MessengerFriend } from './MessengerFriend';

export class Messenger
{
    private _friends: MessengerFriend[];

    constructor(private readonly _userId: number)
    {
        if(!_userId) throw new Error('invalid_user_id');

        this._friends = [];
    }

    public async init(): Promise<boolean>
    {
        await this.loadFriends();
            
        return Promise.resolve(true);
    }

    public getFriend(friendId: number, username?: string): MessengerFriend
    {
        if(!friendId && !username) return null;

        let result = null;

        for(const friend of this._friends)
        {
            if(friend.userId === friendId || friend.username === username)
            {
                result = friend;

                break;
            }
        }

        return result;
    }

    public updateAllFriends(_entity: UserEntity): boolean
    {
        for(const friend of this._friends)
        {
            if(friend.online)
            {
                const friendInstance = Emulator.gameManager().userManager().getUser(friend.userId);

                if(!(friendInstance instanceof User)) return;

                if(friendInstance.userMessenger())
                {
                    const findSelf = friendInstance.userMessenger().getFriend(this.userId);

                    if(!findSelf) return;

                    //
                }
            }
        }

        return true;
    }

    public addFriend(friend: MessengerFriend): boolean
    {
        if(!(friend instanceof MessengerFriend)) return false;
        
        let result = false;

        for(const [index, existing] of this._friends.entries())
        {
            if(existing.userId === friend.userId)
            {
                result = true;

                this._friends.splice(index, 1);

                this._friends.push(friend);

                break;
            }
        }

        if(!result) this._friends.push(friend);
        
        return true;
    }

    public removeFriend(friendId: number): boolean
    {
        for(const [index, existing] of this._friends.entries())
        {
            if(existing.userId === friendId)
            {
                this._friends.splice(index, 1);

                break;
            }
        }

        return true;
    }

    public async loadFriends(): Promise<boolean>
    {
        this._friends = [];

        const results = await getManager().find(MessengerFriendEntity, {
            where: {
                userId: this._userId
            },
            relations: ['friend']
        });

        if(!results) return Promise.resolve(true);

        for(const friend of results) this.addFriend(new MessengerFriend(friend));

        return Promise.resolve(true);
    }

    public get userId(): number
    {
        return this._userId;
    }

    public get friends(): MessengerFriend[]
    {
        return this._friends;
    }
}