import { getManager, In } from 'typeorm';

import { Emulator } from '../../../Emulator';
import { MessengerFriendEntity, MessengerRequestEntity, TimeHelper, MessengerCategoryEntity } from '../../../common';
import { MessengerChatComposer, MessengerRequestComposer, MessengerRequestErrorComposer, MessengerUpdateComposer } from '../../../packets';

import { User } from '../User';
import { MessengerCategory } from './MessengerCategory';
import { MessengerFriend } from './MessengerFriend';
import { MessengerFriendRequest } from './MessengerFriendRequest';
import { MessengerFriendRequestError } from './MessengerFriendRequestError';
import { MessengerUpdate } from './MessengerUpdate';

export class Messenger
{
    private _categories: MessengerCategory[];
    private _friends: MessengerFriend[];
    private _friendRequests: MessengerFriendRequest[];

    private _pendingUpdates: MessengerUpdate[];
    private _startReceiving: boolean;

    private _isLoaded: boolean;
    private _isLoading: boolean;
    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(private _user: User)
    {
        if(!_user || !_user.userId) throw new Error('invalid_user');
        
        this._categories        = [];
        this._friends           = [];
        this._friendRequests    = [];

        this._pendingUpdates    = [];
        this._startReceiving    = false;

        this._isLoaded      = false;
        this._isLoading     = false;
        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading)
        {
            this._isLoading = true;

            await this.loadCategories();
            await this.loadFriends();
            await this.loadRequests();

            this._isLoaded  = true;
            this._isLoading = false;
        }
    }

    public async getFriend(friendId: number): Promise<MessengerFriend>
    {
        let result: MessengerFriend = null;

        if(friendId)
        {
            if(this._isLoaded)
            {
                const totalFriends = this._friends.length;

                for(let i = 0; i < totalFriends; i++)
                {
                    const friend = this._friends[i];

                    if(friend.userId === friendId)
                    {
                        result = friend;

                        break;
                    }
                }
            }
            else
            {
                const dbResult = await getManager().findOne(MessengerFriendEntity, {
                    where: {
                        userId: this._user.userId,
                        friendId: friendId
                    },
                    relations: ['friend']
                });

                if(dbResult)
                {
                    result = {
                        userId: dbResult.friend.id,
                        username: dbResult.friend.username,
                        motto: dbResult.friend.motto,
                        gender: dbResult.friend.gender,
                        figure: dbResult.friend.figure,
                        online: dbResult.friend.online === '1' ? true : false,
                        relation: dbResult.relation
                    }
                }
            }
        }

        return Promise.resolve(result);
    }

    public async hasFriend(friendId: number): Promise<boolean>
    {
        let result = false;

        if(friendId)
        {
            if(this._isLoaded)
            {
                const totalFriends = this._friends.length;

                for(let i = 0; i < totalFriends; i++)
                {
                    const friend = this._friends[i];

                    if(friend.userId === friendId)
                    {
                        result = true;

                        break;
                    }
                }
            }
            else
            {
                const dbResult = await getManager().findOne(MessengerFriendEntity, {
                    where: {
                        userId: this._user.userId,
                        friendId: friendId
                    }
                });

                if(dbResult) result = true;
            }
        }

        return Promise.resolve(result);
    }

    public async getRequest(requestorId: number): Promise<MessengerFriendRequest>
    {
        let result: MessengerFriendRequest = null;

        if(requestorId)
        {
            if(this._isLoaded)
            {
                const totalRequests = this._friendRequests.length;

                for(let i = 0; i < totalRequests; i++)
                {
                    const request = this._friendRequests[i];

                    if(request.userId === requestorId)
                    {
                        result = request;

                        break;
                    }
                }
            }
            else
            {
                const dbResult = await getManager().findOne(MessengerRequestEntity, {
                    where: {
                        userId: requestorId,
                        requestedId: this._user.userId
                    },
                    relations: ['user']
                });

                if(dbResult)
                {
                    result = {
                        userId: dbResult.user.id,
                        username: dbResult.user.username,
                        figure: dbResult.user.figure
                    }
                }
            }
        }

        return Promise.resolve(result);
    }

    public async hasRequest(requestorId: number): Promise<boolean>
    {
        let result = false;

        if(requestorId)
        {
            if(this._isLoaded)
            {
                const totalRequests = this._friendRequests.length;

                for(let i = 0; i < totalRequests; i++)
                {
                    const request = this._friendRequests[i];

                    if(request.userId === requestorId)
                    {
                        result = true;

                        break;
                    }
                }
            }
            else
            {
                const dbResult = await getManager().findOne(MessengerRequestEntity, {
                    where: {
                        userId: requestorId,
                        requestedId: this._user.userId
                    }
                });

                if(dbResult) result = true;
            }
        }

        return Promise.resolve(result);
    }

    public async composeUpdates(startReceiving = false): Promise<void>
    {
        if(startReceiving) this._startReceiving = true;

        if(this._startReceiving)
        {
            if(this._user.isAuthenticated && this._user.client()) await this._user.client().processComposer(new MessengerUpdateComposer(this._user));
        }
    }

    public clearPendingUpdates(): void
    {
        this._pendingUpdates = [];
    }

    private async addFriend(friendIds: number[]): Promise<void>
    {
        const totalToAdd = friendIds.length;

        if(totalToAdd)
        {
            for(let i = 0; i < totalToAdd; i++)
            {
                const friendId = friendIds[i];

                if(!(await this.hasFriend(friendId)))
                {
                    const newFriend = await Emulator.gameManager().userManager().getUser(friendId);

                    if(newFriend && newFriend.messenger())
                    {
                        if(!(await newFriend.messenger().hasFriend(this._user.userId)))
                        {
                            await getManager().insert(MessengerFriendEntity, [
                                {
                                    userId: this._user.userId,
                                    friendId: friendId
                                },
                                {
                                    userId: friendId,
                                    friendId: this._user.userId
                                }
                            ]);

                            if(this._isLoaded)
                            {
                                const friend: MessengerFriend = {
                                    userId: newFriend.userId,
                                    username: newFriend.username,
                                    motto: newFriend.motto,
                                    gender: newFriend.gender,
                                    figure: newFriend.figure,
                                    online: newFriend.online,
                                    relation: 0
                                };

                                this._friends.push(friend);
                                this._pendingUpdates.push({ type: 'add', friend: friend });
                            }

                            if(newFriend.messenger().isLoaded)
                            {
                                const friend: MessengerFriend = {
                                    userId: this._user.userId,
                                    username: this._user.username,
                                    motto: this._user.motto,
                                    gender: this._user.gender,
                                    figure: this._user.figure,
                                    online: this._user.online,
                                    relation: 0
                                };

                                newFriend.messenger().friends.push(friend);
                                newFriend.messenger().pendingUpdates.push({ type: 'add', friend: friend });

                                await newFriend.messenger().composeUpdates();
                            }
                        }
                    }
                    else
                    {
                        if(this._user.isAuthenticated && this._user.client()) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerFriendRequestError.NOT_FOUND));
                    }
                }
            }

            await this.composeUpdates();
        }
    }

    public async removeFriend(friendIds: number[]): Promise<void>
    {
        const totalToRemove                 = friendIds.length;
        const friendIdsRemoved: number[]    = [];

        if(totalToRemove)
        {
            if(this._isLoaded)
            {
                const totalFriends = this._friends.length;

                for(let i = 0; i < totalToRemove; i++)
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

                            friendIdsRemoved.push(friend.userId);

                            this._pendingUpdates.push({ type: 'remove', friend: friend });

                            this._friends.splice(j, 1);

                            break;
                        }
                    }
                }
            }
            else
            {
                for(let i = 0; i < totalToRemove; i++)
                {
                    const friendId = friendIds[i];

                    const result = await getManager().delete(MessengerFriendEntity, {
                        userId: this._user.userId,
                        friendId: friendId
                    });

                    if(result.affected === 1) friendIdsRemoved.push(friendId);
                }
            }
        }

        const totalRemoved = friendIdsRemoved.length;

        if(totalRemoved)
        {
            for(let i = 0; i < totalRemoved; i++)
            {
                const friendId = friendIdsRemoved[i];

                const deletedFriend = await Emulator.gameManager().userManager().getUser(friendId);

                if(deletedFriend && deletedFriend.messenger())
                {
                    await getManager().delete(MessengerFriendEntity, {
                        userId: friendId,
                        friendId: this._user.userId
                    });

                    if(deletedFriend.messenger().isLoaded)
                    {
                        const totalFriendFriends = deletedFriend.messenger().friends.length;

                        for(let j = 0; j < totalFriendFriends; j++)
                        {
                            const friendFriend = deletedFriend.messenger().friends[j];

                            if(friendFriend.userId === this._user.userId)
                            {
                                deletedFriend.messenger().friends.splice(j, 1);

                                deletedFriend.messenger().pendingUpdates.push({ type: 'remove', friend: friendFriend });

                                await deletedFriend.messenger().composeUpdates();

                                break;
                            }
                        }
                    }
                }
            }
        }

        await this.composeUpdates();
    }

    private async updateFriend(update: MessengerFriend): Promise<void>
    {
        if(update && this._isLoaded)
        {
            const totalFriends = this._friends.length;

            for(let i = 0; i < totalFriends; i++)
            {
                const friend = this._friends[i];

                if(friend.userId === update.userId)
                {
                    if(update.username) friend.username       = update.username;
                    if(update.motto) friend.motto             = update.motto;
                    if(update.gender) friend.gender           = update.gender;
                    if(update.figure) friend.figure           = update.figure;
                    if(update.online !== null) friend.online  = update.online;

                    this._pendingUpdates.push({ type: 'update', friend: friend });

                    await this.composeUpdates();

                    break;
                }
            }
        }
    }

    public async updateRelation(friendId: number, relation: 0 | 1 | 2 | 3): Promise<void>
    {
        if(friendId && relation >= 0 && relation <= 3)
        {
            await getManager().update(MessengerFriendEntity, {
                userId: this._user.userId,
                friendId: friendId
            }, {
                relation: relation
            });

            if(this._isLoaded)
            {
                const totalFriends = this._friends.length;

                for(let i = 0; i < totalFriends; i++)
                {
                    const friend = this._friends[i];

                    if(friend.userId === friendId)
                    {
                        friend.relation = relation;

                        this._pendingUpdates.push({ type: 'update', friend: friend });

                        await this.composeUpdates();

                        break;
                    }
                }
            }
        }
    }

    public async updateAllFriends(): Promise<void>
    {
        if(this._isLoaded)
        {
            const totalFriends = this._friends.length;

            for(let i = 0; i < totalFriends; i++)
            {
                const friend = this._friends[i];

                const friendInstance = await Emulator.gameManager().userManager().getOnlineUser(friend.userId);

                if(friendInstance && friendInstance.messenger()) await friendInstance.messenger().updateFriend({
                    userId: this._user.userId,
                    username: this._user.username,
                    motto: this._user.motto,
                    gender: this._user.gender,
                    figure: this._user.figure,
                    online: this._user.online
                });
            }
        }
    }

    private async loadCategories(): Promise<void>
    {
        if(!this._isLoaded)
        {
            const results = await getManager().find(MessengerCategoryEntity, {
                where: {
                    userId: this._user.userId
                }
            });

            const totalCategories = results.length;

            if(results && totalCategories)
            {
                for(let i = 0; i < totalCategories; i++)
                {
                    const result = results[i];

                    this._categories.push({
                        id: result.id,
                        name: result.categoryName
                    });
                }
            }
        }
    }

    private async loadFriends(): Promise<void>
    {
        if(!this._isLoaded)
        {
            const results = await getManager().find(MessengerFriendEntity, {
                where: {
                    userId: this._user.userId
                },
                relations: ['friend']
            });

            const totalResults = results.length;

            if(results && totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

                    this._friends.push({
                        userId: result.friendId,
                        username: result.friend.username,
                        motto: result.friend.motto,
                        gender: result.friend.gender,
                        figure: result.friend.figure,
                        online: result.friend.online === '1' ? true : false,
                        categoryId: result.categoryId || 0,
                        relation: result.relation
                    });
                }
            }
        }
    }

    private async loadRequests(): Promise<void>
    {
        if(!this._isLoaded)
        {
            const results = await getManager().find(MessengerRequestEntity, {
                where: {
                    requestedId: this._user.userId
                },
                relations: ['user']
            });

            const totalResults = results.length;

            if(results && totalResults)
            {
                for(let i = 0; i < totalResults; i++)
                {
                    const result = results[i];

                    this._friendRequests.push({
                        userId: result.userId,
                        username: result.user.username,
                        figure: result.user.figure
                    });
                }
            }
        }
    }

    public async sendRequest(requestedId: number, requestedUsername?: string): Promise<void>
    {
        const requestedInstance = requestedId && !requestedUsername ? await Emulator.gameManager().userManager().getUser(requestedId) : await Emulator.gameManager().userManager().getUser(0, requestedUsername);

        if(requestedInstance)
        {
            if(!(await this.hasRequest(requestedInstance.userId)))
            {
                if(!(await this.hasFriend(requestedInstance.userId)))
                {
                    if(requestedInstance.messenger())
                    {
                        if(!requestedInstance.info().friendRequestsDisabled)
                        {
                            if(!(await requestedInstance.messenger().hasRequest(this._user.userId)))
                            {
                                if(!(await requestedInstance.messenger().hasFriend(this._user.userId)))
                                {
                                    await getManager().insert(MessengerRequestEntity, {
                                        userId: this._user.userId,
                                        requestedId: requestedInstance.userId
                                    });

                                    if(requestedInstance.messenger().isLoaded)
                                    {
                                        const newRequest: MessengerFriendRequest = {
                                            userId: this._user.userId,
                                            username: this._user.username,
                                            figure: this._user.figure
                                        };

                                        requestedInstance.messenger().friendRequests.push(newRequest);

                                        if(requestedInstance.isAuthenticated && requestedInstance.client()) await requestedInstance.client().processComposer(new MessengerRequestComposer(requestedInstance, newRequest));
                                    }
                                }
                            }
                        }
                        else
                        {
                            if(this._user.isAuthenticated && this._user.client()) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerFriendRequestError.FRIEND_REQUESTS_DISABLED));
                        }
                    }
                    else
                    {
                        if(this._user.isAuthenticated && this._user.client()) await this._user.client().processComposer(new MessengerRequestErrorComposer(this._user, MessengerFriendRequestError.NOT_FOUND));
                    }
                }
            }
        }
    }

    public async acceptRequest(requestorIds: number[]): Promise<void>
    {
        const totalToAccept                 = requestorIds.length;
        const requestsAccepted: number[]    = [];

        if(requestorIds && totalToAccept)
        {
            if(this._isLoaded)
            {
                const totalRequests = this._friendRequests.length;

                for(let i = 0; i < totalToAccept; i++)
                {
                    const requestorId = requestorIds[i];

                    for(let j = 0; j < totalRequests; j++)
                    {
                        const request = this._friendRequests[j];

                        if(request.userId === requestorId)
                        {
                            await getManager().delete(MessengerRequestEntity, {
                                userId: requestorId,
                                requestedId: this._user.userId
                            });

                            await getManager().delete(MessengerRequestEntity, {
                                userId: this._user.userId,
                                requestedId: requestorId
                            });

                            this._friendRequests.splice(j, 1);

                            requestsAccepted.push(requestorId);

                            break;
                        }
                    }
                }
            }
            else
            {
                // write offline variant
            }
        }

        if(requestsAccepted && this._isLoaded) await this.addFriend(requestsAccepted);
    }

    public async declineAllRequests(): Promise<void>
    {
        await getManager().delete(MessengerRequestEntity, {
            requestedId: this._user.userId
        });

        this._friendRequests = [];
    }

    public async declineRequest(userIds: number[]): Promise<void>
    {
        const totalToDecline = userIds.length;

        if(userIds && totalToDecline)
        {
            if(this._isLoaded)
            {
                const totalRequests = this._friendRequests.length;

                for(let i = 0; i < totalToDecline; i++)
                {
                    const userId = userIds[i];

                    for(let j = 0; j < totalRequests; j++)
                    {
                        const request = this._friendRequests[j];

                        if(request.userId === userId)
                        {
                            await getManager().delete(MessengerRequestEntity, {
                                userId: userId,
                                requestedId: this._user.userId
                            });

                            this._friendRequests.splice(j, 1);

                            break;
                        }
                    }
                }
            }
        }
    }

    public async sendMessage(friendId: number, message: string): Promise<void>
    {
        if(friendId && message)
        {
            if(this._isLoaded)
            {
                const totalFriends = this._friends.length;

                for(let i = 0; i < totalFriends; i++)
                {
                    const friend = this._friends[i];

                    if(friend.userId === friendId)
                    {
                        const friendInstance = await Emulator.gameManager().userManager().getUser(friend.userId);

                        if(friendInstance && friendInstance.messenger()) await friendInstance.messenger().receiveMessage(this._user.userId, message);

                        break;
                    }
                }
            }
            else
            {
                // send via offline
            }
        }
    }

    private async receiveMessage(friendId: number, message: string)
    {
        if(this._user.isAuthenticated && this._user.client())
        {
            await this._user.client().processComposer(new MessengerChatComposer(this._user, {
                userId: friendId,
                message: message,
                timestamp: TimeHelper.now
            }));
        }
        else
        {
            // receive offline
        }
    }

    public get categories(): MessengerCategory[]
    {
        return this._categories;
    }

    public get friends(): MessengerFriend[]
    {
        return this._friends;
    }

    public get friendRequests(): MessengerFriendRequest[]
    {
        return this._friendRequests;
    }

    public get pendingUpdates(): MessengerUpdate[]
    {
        return this._pendingUpdates;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}