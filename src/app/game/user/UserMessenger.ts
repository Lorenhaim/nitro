import { getManager } from 'typeorm';

import { Emulator } from '../../Emulator';
import { MessengerFriendEntity, MessengerRequestEntity, TimeHelper } from '../../common';
import { GenericAlertComposer, MessengerChatComposer, MessengerChatErrorComposer, MessengerRemoveComposer, MessengerRequestComposer, MessengerRequestErrorComposer, MessengerUpdateComposer } from '../../packets';

import { User } from '../User';
import { Friend, FriendRequest, MessengerRequestError, MessengerChatError } from './interfaces';

export class UserMessenger
{
    private _friends: Friend[];
    private _requests: FriendRequest[];

    constructor(private _user: User)
    {
        if(!_user || !_user.userId) throw new Error('invalid_user');
        
        this._friends   = [];
        this._requests  = [];
    }

    public async init(): Promise<boolean>
    {
        await this.loadFriends();
        await this.loadRequests();

        return Promise.resolve(true);
    }

    public getFriend(friendId: number): Friend
    {
        if(!friendId) return null;

        const totalFriends = this._friends.length;

        let result: Friend = null;

        for(let i = 0; i < totalFriends; i++)
        {
            const friend = this._friends[i];

            if(friend.userId === friendId)
            {
                result = friend;

                break;
            }
        }

        return result;
    }

    private addFriend(friends: Friend[]): boolean
    {
        if(!friends) return false;

        const totalFriends = this._friends.length;

        let totalNewFriends = friends.length;

        for(let i = 0; i < totalNewFriends; i++)
        {
            let result: boolean = false;

            for(let j = 0; j < totalFriends; j++)
            {
                if(this._friends[j].userId === friends[i].userId)
                {
                    this._friends.splice(j, 1);

                    this._friends.push(friends[i]);

                    result = true;

                    break;
                }
            }

            if(!result) this._friends.push(friends[i]);
        }

        return true;
    }

    private removeFriend(friendIds: number[]): boolean
    {
        if(!friendIds) return false;

        const totalFriends  = this._friends.length;
        const totalToDelete = friendIds.length;

        for(let i = 0; i < totalToDelete; i++)
        {
            const friendId = friendIds[i];

            for(let j = 0; j < totalFriends; j++)
            {
                if(this._friends[j].userId === friendId)
                {
                    this._friends.splice(j, 1);

                    break;
                }
            }
        }

        return true;
    }

    public getRequest(requestorId: number): FriendRequest
    {
        if(!requestorId) return null;

        const totalRequests = this._requests.length;

        let result: FriendRequest = null;

        for(let i = 0; i < totalRequests; i++)
        {
            const request = this._requests[i];

            if(request.userId === requestorId)
            {
                result = request;

                break;
            }
        }

        return result;
    }

    private addRequest(requests: FriendRequest[]): boolean
    {
        if(!requests) return false;

        const totalRequests       = this._requests.length;
        const totalNewRequests    = requests.length;

        for(let i = 0; i < totalNewRequests; i++)
        {
            let result: boolean = false;

            for(let j = 0; j < totalRequests; j++)
            {
                if(this._requests[j].userId === requests[i].userId)
                {
                    this._requests.splice(j, 1);

                    this._requests.push(requests[i]);

                    result = true;

                    break;
                }
            }

            if(!result) this._requests.push(requests[i]);
        }

        return true;
    }

    private removeRequest(requestorIds: number[]): boolean
    {
        if(!requestorIds) return false;

        const totalRequests = this._requests.length;
        const totalToDelete = requestorIds.length;

        for(let i = 0; i < totalToDelete; i++)
        {
            const requestorId = requestorIds[i];

            for(let j = 0; j < totalRequests; j++)
            {
                if(this._requests[j].userId === requestorId)
                {
                    this._requests.splice(j, 1);

                    break;
                }
            }
        }

        return true;
    }

    private async loadFriends(): Promise<boolean>
    {
        this._friends = [];

        const results = await getManager().find(MessengerFriendEntity, {
            where: {
                userId: this._user.userId
            },
            relations: ['friend']
        });

        if(!results) return Promise.resolve(true);

        const totalFriends = results.length;

        for(let i = 0; i < totalFriends; i++)
        {
            const result = results[i];

            this.addFriend([{
                userId: result.friend.id,
                username: result.friend.username,
                motto: result.friend.motto,
                gender: result.friend.gender,
                figure: result.friend.figure,
                online: result.friend.online === '1',
                relation: result.relation
            }]);
        }

        return Promise.resolve(true);
    }

    private async loadRequests(): Promise<boolean>
    {
        this._requests = [];

        const results = await getManager().find(MessengerRequestEntity, {
            where: {
                requestedId: this._user.userId
            },
            relations: ['user']
        });

        if(!results) return Promise.resolve(true);

        const totalRequests = results.length;

        for(let i = 0; i < totalRequests; i++)
        {
            const result = results[i];

            this.addRequest([{
                userId: result.user.id,
                username: result.user.username,
                figure: result.user.figure,
            }]);
        }

        return Promise.resolve(true);
    }

    private async updateFriend(update: Friend): Promise<boolean>
    {
        if(update)
        {
            const totalFriends = this._friends.length;

            for(let i = 0; i < totalFriends; i++)
            {
                const friend = this._friends[i];

                if(friend.userId === update.userId)
                {
                    this._friends[i] = {
                        userId: friend.userId,
                        username: update.username,
                        motto: update.motto,
                        gender: update.gender,
                        figure: update.figure,
                        online: update.online,
                        relation: friend.relation
                    };

                    if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerUpdateComposer(this._user, [ update ]));

                    break;
                }
            }
        }

        return Promise.resolve(true);
    }

    public async updateAllFriends(update: Friend): Promise<boolean>
    {
        if(update)
        {
            const totalFriends = this._friends.length;

            for(let i = 0; i < totalFriends; i++)
            {
                const friend = this._friends[i];

                if(friend.online)
                {
                    const friendInstance = await Emulator.gameManager().userManager().getUser(friend.userId);

                    if(friendInstance && friendInstance.userMessenger()) await friendInstance.userMessenger().updateFriend(update);
                }
            }
        }

        return Promise.resolve(true);
    }

    public async sendRequest(requestedId: number): Promise<boolean>
    {
        if(requestedId && requestedId !== this._user.userId)
        {
            if(!this.getFriend(requestedId))
            {
                const requested = await Emulator.gameManager().userManager().getUser(requestedId);

                if(!requested || !requested.userMessenger())
                {
                    if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerRequestError.NOT_FOUND));

                    return Promise.resolve(true);
                }
                
                if(!requested.userMessenger().getRequest(this._user.userId))
                {
                    if(this._friends.length >= Emulator.config().getNumber('game.user.messenger.maxFriends', 300))
                    {
                        if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerRequestError.USER_MAX_FRIENDS));

                        return Promise.resolve(true);
                    }

                    if(requested.userInfo().friendRequestsDisabled)
                    {
                        if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerRequestError.FRIEND_REQUESTS_DISABLED));

                        return Promise.resolve(true);
                    }

                    if(requested.userMessenger().friends.length >= Emulator.config().getNumber('game.user.messenger.maxFriends', 300))
                    {
                        if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerRequestError.FRIEND_MAX_FRIENDS));

                        return Promise.resolve(true);
                    }

                    await getManager().insert(MessengerRequestEntity, {
                        userId: this._user.userId,
                        requestedId: requestedId
                    });

                    const friendRequest = {
                        userId: this._user.userId,
                        username: this._user.username,
                        figure: this._user.figure
                    };

                    requested.userMessenger().addRequest([ friendRequest ]);

                    if(requested.isAuthenticated && requested.online) await requested.client().processComposer(new MessengerRequestComposer(requested, friendRequest));
                }
            }
        }
        
        return Promise.resolve(true);
    }

    public async acceptRequest(userIds: number[]): Promise<boolean>
    {
        const totalUserIds = userIds.length;

        if(totalUserIds)
        {
            const totalFriends  = this._friends.length;
            const totalRequests = this._requests.length;

            const accepted: Friend[] = [];

            for(let i = 0; i < totalUserIds; i++)
            {
                const userId = userIds[i];

                for(let j = 0; j < totalRequests; j++)
                {
                    if(this._requests[j].userId === userId)
                    {
                        if(!this.getFriend(userId))
                        {
                            await getManager().delete(MessengerRequestEntity, {
                                userId: userId,
                                requestedId: this._user.userId
                            });

                            this._requests.splice(j, 1);

                            if(totalFriends + accepted.length >= Emulator.config().getNumber('game.user.messenger.maxFriends', 300))
                            {
                                if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new GenericAlertComposer(this._user, 'user_max_friends'));

                                continue;
                            }

                            const friend = await Emulator.gameManager().userManager().getUser(userId);

                            if(friend && friend.userMessenger())
                            {
                                if(friend.userMessenger().friends.length >= Emulator.config().getNumber('game.user.messenger.maxFriends', 300))
                                {
                                    if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new GenericAlertComposer(this._user, 'user_max_friends'));

                                    continue;
                                }

                                if(friend.userInfo().friendRequestsDisabled)
                                {
                                    if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new GenericAlertComposer(this._user, 'friend_request_disabled'));

                                    continue;
                                }

                                await getManager().insert(MessengerFriendEntity, [
                                    {
                                        userId: this._user.userId,
                                        friendId: userId
                                    },
                                    {
                                        userId: userId,
                                        friendId: this._user.userId
                                    }
                                ], { 
                                    reload: false
                                });

                                const newFriend: Friend = {
                                    userId: this._user.userId,
                                    username: this._user.username,
                                    motto: this._user.motto,
                                    gender: this._user.gender,
                                    figure: this._user.figure,
                                    online: this._user.online,
                                    relation: '0'
                                };

                                friend.userMessenger().addFriend([ newFriend ]);
            
                                if(friend.isAuthenticated && friend.online) await friend.client().processComposer(new MessengerUpdateComposer(friend, [ newFriend ]));
                                
                                accepted.push({
                                    userId: userId,
                                    username: friend.username,
                                    motto: friend.motto,
                                    gender: friend.gender,
                                    figure: friend.figure,
                                    online: friend.online,
                                    relation: '0'
                                });
                            }
                        }

                        break;
                    }
                }
            }

            if(accepted)
            {
                this.addFriend(accepted);

                if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerUpdateComposer(this._user, accepted));
            }
        }

        return Promise.resolve(true);
    }

    public async deleteFriend(friendIds: number[]): Promise<boolean>
    {
        const totalToDelete = friendIds.length;

        if(totalToDelete)
        {
            const totalFriends = this._friends.length;

            const deleted: number[] = [];

            for(let i = 0; i < totalToDelete; i++)
            {
                const friendId = friendIds[i];

                for(let j = 0; j < totalFriends; j++)
                {
                    const friend = this._friends[j];

                    if(friend.userId === friendId)
                    {
                        await getManager().delete(MessengerFriendEntity, {
                            userId: this._user.userId,
                            friendId: friendId
                        });

                        await getManager().delete(MessengerFriendEntity, {
                            userId: friendId,
                            friendId: this._user.userId
                        });

                        const friendInstance = await Emulator.gameManager().userManager().getUser(friendId);

                        if(friendInstance && friendInstance.userMessenger())
                        {
                            friendInstance.userMessenger().removeFriend([ this._user.userId ]);

                            if(friendInstance.isAuthenticated && friendInstance.online) await friendInstance.client().processComposer(new MessengerRemoveComposer(friendInstance, [ this._user.userId ]));
                        }

                        deleted.push(friendId);

                        break;
                    }
                }
            }

            if(deleted)
            {
                this.removeFriend(deleted);

                if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerRemoveComposer(this._user, deleted));
            }
        }

        return Promise.resolve(true);
    }

    public async sendMessage(friendId: number, message: string): Promise<boolean>
    {
        if(friendId && message)
        {
            const totalFriends = this._friends.length;

            let friendFound = false;
            let messageSent = false;

            for(let i = 0; i < totalFriends; i++)
            {
                const friend = this._friends[i];

                if(friend.userId === friendId)
                {
                    friendFound = true;

                    const friendInstance = await Emulator.gameManager().userManager().getUser(friendId);

                    if(friendInstance)
                    {
                        if(!friendInstance.isAuthenticated || !friendInstance.online)
                        {
                            //if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerChatErrorComposer(this._user, MessengerChatError.FRIEND_OFFLINE));

                            break;
                        }

                        if(!friendInstance.userMessenger())
                        {
                            //if(this._user.isAuthenticated && this._user.online) await this._user.client().processComposer(new MessengerChatErrorComposer(this._user, MessengerChatError.FRIEND_MESSENGER));

                            break;
                        }
                        
                        await friendInstance.client().processComposer(new MessengerChatComposer(friendInstance, {
                            userId: this._user.userId,
                            message: message,
                            timestamp: TimeHelper.now
                        }));

                        messageSent = true;
                    }

                    break;
                }
            }

            if(!messageSent)
            {
                if(friendId === this._user.userId)
                
                if(this._user.isAuthenticated && this._user.online)
                {
                    //if(!friendFound) await this._user.client().processComposer(new MessengerChatErrorComposer(this._user, MessengerChatError.INVALID_FRIEND));
                }
            }
        }

        return Promise.resolve(true);
    }

    public get friends(): Friend[]
    {
        return this._friends;
    }

    public get requests(): FriendRequest[]
    {
        return this._requests;
    }
}