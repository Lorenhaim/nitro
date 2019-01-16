import { getManager } from 'typeorm';

import { Emulator } from '../../../Emulator';
import { MessengerFriendEntity, MessengerFriendRequestEntity, UserEntity } from '../../../common';
import { MessengerUpdateComposer, MessengerRemoveComposer } from '../../../packets';

import { User } from '../User';
import { MessengerFriend } from './MessengerFriend';
import { MessengerFriendRequest } from './MessengerFriendRequest';

export class Messenger
{
    private _friends: MessengerFriend[];
    private _requests: MessengerFriendRequest[];

    constructor(private readonly _userId: number)
    {
        if(!_userId) throw new Error('invalid_user_id');

        this._friends   = [];
        this._requests  = [];
    }

    public async init(): Promise<boolean>
    {
        await this.loadFriends();
        await this.loadRequests();
            
        return Promise.resolve(true);
    }

    public getFriend(friendId: number, username?: string): MessengerFriend
    {
        if(!friendId && !username) return null;

        let result = null;

        for(const friend of this._friends)
        {
            if(friend.friendId === friendId || friend.username === username)
            {
                result = friend;

                break;
            }
        }

        return result;
    }

    public getRequest(userId: number, username?: string): MessengerFriendRequest
    {
        if(!userId && !username) return null;

        let result = null;

        for(const request of this._requests)
        {
            if(request.userId === userId || request.username === username)
            {
                result = request;

                break;
            }
        }

        return result;
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

    public addRequest(request: MessengerFriendRequest): boolean
    {
        if(!(request instanceof MessengerFriendRequest)) return false;
        
        let result = false;

        for(const [index, existing] of this._requests.entries())
        {
            if(existing.userId === request.userId)
            {
                result = true;

                this._requests.splice(index, 1);

                this._requests.push(request);

                break;
            }
        }

        if(!result) this._requests.push(request);
        
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

    public removeRequest(requestedId: number): boolean
    {
        for(const [index, existing] of this._requests.entries())
        {
            if(existing.userId === requestedId)
            {
                this._requests.splice(index, 1);

                break;
            }
        }

        return true;
    }

    public async updateAllFriends(entity: UserEntity): Promise<boolean>
    {
        for(const friend of this._friends)
        {
            const friendInstance = await Emulator.gameManager().userManager().getUser(friend.friendId);

            if(friendInstance instanceof User && friendInstance.online && friendInstance.userMessenger())
            {
                const findSelf = friendInstance.userMessenger().getFriend(this.userId);

                if(findSelf)
                {
                    findSelf.update(entity);

                    await friendInstance.client().processComposer(new MessengerUpdateComposer(friendInstance, [ findSelf ])); 
                }
            }
        }

        return Promise.resolve(true);
    }

    public async acceptRequests(friendIds: number[]): Promise<boolean>
    {
        if(!friendIds || !friendIds.length) return Promise.reject(new Error('nothing_to_delete'));

        const user = await Emulator.gameManager().userManager().getUser(this.userId);

        if(!user) return Promise.reject(new Error('invalid_user'));

        let acceptedFriends: MessengerFriend[] = [];

        for(const friendId of friendIds)
        {
            for(const [index, request] of this._requests.entries())
            {
                if(request.userId === friendId)
                {
                    const myFriend = new MessengerFriendEntity();

                    myFriend.userId   = this.userId;
                    myFriend.friendId = friendId;

                    const theirFriend = new MessengerFriendEntity();

                    theirFriend.userId   = friendId;
                    theirFriend.friendId = this.userId;

                    await getManager().save([ myFriend, theirFriend ]);

                    await getManager().delete(MessengerFriendRequestEntity, {
                        userId: friendId,
                        requestedId: this.userId
                    });
        
                    const friend = await Emulator.gameManager().userManager().getUser(friendId);
        
                    if(friend instanceof User && friend.online && friend.userMessenger())
                    {
                        theirFriend.friend = user.entity;

                        const theirFriendInstance = new MessengerFriend(theirFriend);

                        friend.userMessenger().addFriend(theirFriendInstance);
        
                        await friend.client().processComposer(new MessengerUpdateComposer(friend, [ theirFriendInstance ]));
                    }

                    myFriend.friend = friend.entity;

                    acceptedFriends.push(new MessengerFriend(myFriend));

                    this._requests.splice(index, 1);
                }
            }
        }

        if(acceptedFriends && acceptedFriends.length > 0)
        {
            if(user instanceof User && user.online && user.userMessenger())
            {
                for(const friend of acceptedFriends) this.addFriend(friend);

                await user.client().processComposer(new MessengerUpdateComposer(user, acceptedFriends));
            }
        }

        return Promise.resolve(true);
    }

    public async deleteFriends(friendIds: number[]): Promise<boolean>
    {
        if(!friendIds || !friendIds.length) return Promise.reject(new Error('nothing_to_delete'));

        let results = 0;

        for(const friendId of friendIds)
        {
            for(const friend of this._friends)
            {
                if(friend.friendId === friendId)
                {
                    await getManager().delete(MessengerFriendEntity, {
                        userId: this.userId,
                        friendId: friendId
                    });
            
                    await getManager().delete(MessengerFriendEntity, {
                        userId: friendId,
                        friendId: this.userId
                    });
        
                    const friend = await Emulator.gameManager().userManager().getUser(friendId);
        
                    if(friend instanceof User && friend.online && friend.userMessenger())
                    {
                        friend.userMessenger().removeFriend(this.userId);
        
                        await friend.client().processComposer(new MessengerRemoveComposer(friend, [ this.userId ]));
                    }

                    this.removeFriend(friendId);
                    results++;
                }
            }
        }

        if(results > 0)
        {
            const user = await Emulator.gameManager().userManager().getUser(this.userId);

            if(user instanceof User && user.online && user.userMessenger()) await user.client().processComposer(new MessengerRemoveComposer(user, friendIds));
        }

        return Promise.resolve(true);
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

    public async loadRequests(): Promise<boolean>
    {
        this._requests = [];

        const results = await getManager().find(MessengerFriendRequestEntity, {
            where: {
                requestedId: this._userId
            },
            relations: ['user']
        });

        if(!results) return Promise.resolve(true);

        for(const request of results) this.addRequest(new MessengerFriendRequest(request));

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

    public get requests(): MessengerFriendRequest[]
    {
        return this._requests;
    }
}