import { getManager } from 'typeorm';
import { Manager, TimeHelper } from '../../../common';
import { MessengerDao, MessengerFriendEntity, MessengerRequestEntity } from '../../../database';
import { Nitro } from '../../../Nitro';
import { MessengerChatComposer, MessengerRequestComposer, MessengerUpdateComposer } from '../../../packets';
import { User } from '../User';
import { MessengerRelationships, MessengerRelationshipType, MessengerUpdateType } from './interfaces';
import { MessengerCategory } from './MessengerCategory';
import { MessengerFriend } from './MessengerFriend';
import { MessengerRequest } from './MessengerRequest';

export class UserMessenger extends Manager
{
    private _user: User;

    private _categories: MessengerCategory[];
    private _friends: MessengerFriend[];
    private _requests: MessengerRequest[];
    private _requestsSent: number[];

    constructor(user: User)
    {
        super('UserMessenger', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;
        
        this._categories    = [];
        this._friends       = [];
        this._requests      = [];
        this._requestsSent  = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadCategories();
        await this.loadFriends();
        await this.loadRequests();
        await this.loadRequestsSent();
    }

    protected async onDispose(): Promise<void>
    {
        this._categories    = [];
        this._friends       = [];
        this._requests      = [];
        this._requestsSent  = [];
    }

    public getFriend(friendId: number): MessengerFriend
    {
        if(!friendId) return null;

        const totalFriends = this._friends.length;

        if(!totalFriends) return null;

        for(let i = 0; i < totalFriends; i++)
        {
            const friend = this._friends[i];

            if(!friend) continue;

            if(friend.id === friendId) return friend;
        }

        return null;
    }

    public hasFriend(friendId: number): boolean
    {
        return this.getFriend(friendId) !== null;
    }

    public getRequest(requestorId: number): MessengerRequest
    {
        if(!requestorId) return null;

        const totalRequests = this._requests.length;

        if(!totalRequests) return null;

        for(let i = 0; i < totalRequests; i++)
        {
            const request = this._requests[i];

            if(!request) continue;

            if(request.id === requestorId) return request;
        }

        return null;
    }

    public didRequest(requestedId: number): boolean
    {
        if(!requestedId) return false;

        const totalSent = this._requestsSent.length;

        if(!totalSent) return false;

        for(let i = 0; i < totalSent; i++)
        {
            const userId = this._requestsSent[i];

            if(!userId) continue;

            if(userId === requestedId) return true;
        }

        return false;
    }

    public getRelationships(): MessengerRelationships
    {
        const lovers: MessengerFriend[]     = [];
        const friends: MessengerFriend[]    = [];
        const haters: MessengerFriend[]     = [];

        const totalFriends = this._friends.length;

        if(!totalFriends) return { lovers, friends, haters };

        for(let i = 0; i < totalFriends; i++)
        {
            const friend = this._friends[i];

            if(!friend) continue;

            if(friend.relation === MessengerRelationshipType.NONE) continue;

            if(friend.relation === MessengerRelationshipType.LOVER) lovers.push(friend);

            if(friend.relation === MessengerRelationshipType.FRIENDS) friends.push(friend);

            if(friend.relation === MessengerRelationshipType.HATERS) haters.push(friend);
        }

        return { lovers, friends, haters };
    }

    public updateFriend(user: User): void
    {
        if(!user) return;

        const friend = this.getFriend(user.id);

        if(!friend) return;

        friend.username = user.details.username;
        friend.motto    = user.details.motto;
        friend.gender   = user.details.gender;
        friend.figure   = user.details.figure;
        friend.online   = user.details.online;
        friend.inRoom   = user.unit !== null && user.unit.room !== null;

        this._user.connections.processOutgoing(new MessengerUpdateComposer({
            type: MessengerUpdateType.UPDATE,
            friendId: friend.id,
            friend
        }));
    }

    public async updateRelation(friendId: number, relation: MessengerRelationshipType)
    {
        if(!friendId || relation === null) return;

        const friend = this.getFriend(friendId);

        if(!friend) return;

        friend.relation = relation;

        await MessengerDao.updateRelation(this._user.id, friend.id, friend.relation);

        this._user.connections.processOutgoing(new MessengerUpdateComposer({
            type: MessengerUpdateType.UPDATE,
            friendId: friend.id,
            friend
        }));
    }

    public updateAllFriends(): void
    {
        const totalFriends = this._friends.length;

        if(!totalFriends) return;

        for(let i = 0; i < totalFriends; i++)
        {
            const friend = this._friends[i];

            if(!friend) continue;

            if(!friend.online) continue;

            const user = Nitro.gameManager.userManager.getUserById(friend.id);

            if(!user) continue;

            user.messenger.updateFriend(this._user);
        }
    }

    public async acceptFriends(...userIds: number[]): Promise<void>
    {
        const ids = [ ...userIds ];

        if(!ids) return;

        const totalIds = ids.length;

        if(!totalIds) return;

        for(let i = 0; i < totalIds; i++)
        {
            const userId = ids[i];

            if(!userId) continue;

            const request = this.getRequest(userId);

            if(!request) continue;

            await this.removeRequests(userId);

            const friendInstance = await Nitro.gameManager.userManager.getOfflineUserById(userId);

            if(!friendInstance) continue;

            const newFriend = new MessengerFriendEntity();

            newFriend.userId    = this._user.id;
            newFriend.friendId  = userId;

            const friendNew = new MessengerFriendEntity();

            friendNew.userId    = userId;
            friendNew.friendId  = this._user.id;

            await getManager().save([newFriend, friendNew]);

            newFriend.friend = friendInstance.details.entity;

            friendNew.friend = this._user.details.entity;

            const myFriend = new MessengerFriend(newFriend);

            if(myFriend)
            {
                this._friends.push(myFriend);

                this._user.connections.processOutgoing(new MessengerUpdateComposer({
                    type: MessengerUpdateType.ADD,
                    friendId: myFriend.id,
                    friend: myFriend
                }));

                this._user.details.totalFriends++;
            }

            if(friendInstance.isLoaded)
            {
                const theirFriend = new MessengerFriend(friendNew);

                if(theirFriend)
                {
                    const findIndex = friendInstance.messenger.requestsSent.indexOf(this._user.id);

                    if(findIndex !== -1) friendInstance.messenger.requestsSent.splice(findIndex, 1);
                    
                    friendInstance.messenger.friends.push(new MessengerFriend(friendNew));

                    friendInstance.connections.processOutgoing(new MessengerUpdateComposer({
                        type: MessengerUpdateType.ADD,
                        friendId: theirFriend.id,
                        friend: theirFriend
                    }));
                }
            }
        }
    }

    private removeFriendArray(userId: number): boolean
    {
        if(!userId) return false;

        const totalFriends = this._friends.length;

        if(!totalFriends) return false;

        for(let i = 0; i < totalFriends; i++)
        {
            const friend = this._friends[i];

            if(!friend) continue;

            if(friend.id === userId)
            {
                this._friends.splice(i, 1);

                return true;
            }
        }

        return false;
    }

    public async removeFriends(...userIds: number[]): Promise<void>
    {
        const ids = [ ...userIds ];

        if(!ids) return;

        const totalIds = ids.length;

        if(!totalIds) return;

        for(let i = 0; i < totalIds; i++)
        {
            const userId = ids[i];

            if(!userId) continue;

            await MessengerDao.removeFriend(this._user.id, userId);

            if(!this.removeFriendArray(userId)) continue;

            this._user.details.totalFriends--;

            this._user.connections.processOutgoing(new MessengerUpdateComposer({
                type: MessengerUpdateType.REMOVE,
                friendId: userId
            }));

            const user = Nitro.gameManager.userManager.getUserById(userId);

            if(!user) continue;

            if(user.messenger.removeFriendArray(this._user.id))
            {
                user.details.totalFriends--;

                user.connections.processOutgoing(new MessengerUpdateComposer({
                    type: MessengerUpdateType.REMOVE,
                    friendId: this._user.id
                }));
            }
        }
    }

    public async sendRequest(userId: number, username: string = null): Promise<void>
    {
        if(!userId && !username) return;

        let user: User = null;

        if(userId) user = await Nitro.gameManager.userManager.getOfflineUserById(userId);
        else user = await Nitro.gameManager.userManager.getOfflineUserByUsername(username);

        if(!user) return;

        userId = user.id;

        if(this.didRequest(userId)) return;

        if(this.hasFriend(userId)) return;

        const newRequest = new MessengerRequestEntity();

        newRequest.userId       = this._user.id;
        newRequest.requestedId  = userId;

        await getManager().save(newRequest);

        this._requestsSent.push(userId);

        if(user.isLoaded)
        {
            newRequest.user = this._user.details.entity;

            const request = new MessengerRequest(newRequest);

            if(!request) return;

            user.messenger.requests.push(request);

            user.connections.processOutgoing(new MessengerRequestComposer(request));
        }
    }

    public async removeAllRequests(): Promise<void>
    {
        await MessengerDao.removeAllRequests(this._user.id);

        this._requests = [];
    }

    public async removeRequests(...userIds: number[]): Promise<void>
    {
        const ids = [ ...userIds ];

        if(!ids) return;

        const totalIds = ids.length;

        if(!totalIds) return;

        for(let i = 0; i < totalIds; i++)
        {
            const userId = ids[i];

            if(!userId) continue;

            const totalRequests = this._requests.length;

            if(!totalRequests) return;

            for(let j = 0; j < totalRequests; j++)
            {
                const request = this._requests[j];

                if(!request) continue;

                if(request.id === userId)
                {
                    this._requests.splice(j, 1);

                    await MessengerDao.removeRequest(userId, this._user.id);

                    break;
                }
            }
        }
    }

    public sendMessage(friendId: number, message: string): void
    {
        if(!friendId) return;

        const friend = this.getFriend(friendId);

        if(!friend) return;

        if(!friend.online) return;

        const user = Nitro.gameManager.userManager.getUserById(friend.id);

        if(!user) return;

        user.messenger.receiveMessage(this._user.id, message);
    }

    public receiveMessage(friendId: number, message: string): void
    {
        if(!friendId || !message) return;

        this._user.connections.processOutgoing(new MessengerChatComposer({
            userId: friendId,
            message,
            timestamp: TimeHelper.now
        }));
    }

    private async loadCategories(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._categories = []

        const results = await MessengerDao.loadCategories(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._categories.push(new MessengerCategory(result));
        }
    }

    public async loadFriends(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._friends = []

        const results = await MessengerDao.loadFriends(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._friends.push(new MessengerFriend(result));
        }
    }

    private async loadRequests(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._requests = []

        const results = await MessengerDao.loadRequests(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._requests.push(new MessengerRequest(result));
        }
    }

    public async loadRelationships(): Promise<void>
    {
        if(this._isLoaded) return;
        
        const results = await MessengerDao.loadRelationships(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._friends.push(new MessengerFriend(result));
        }
    }

    private async loadRequestsSent(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._requestsSent = []

        const results = await MessengerDao.loadRequestsSent(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._requestsSent.push(result.requestedId);
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get categories(): MessengerCategory[]
    {
        return this._categories;
    }

    public get friends(): MessengerFriend[]
    {
        return this._friends;
    }

    public get requests(): MessengerRequest[]
    {
        return this._requests;
    }

    public get requestsSent(): number[]
    {
        return this._requestsSent;
    }
}