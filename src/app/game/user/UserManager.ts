import { getManager, Like, Not, In } from 'typeorm';

import { Logger, UserEntity } from '../../common';

import { User } from './User';

export class UserManager
{
    private _users: User[];
    private _offlineUsers: User[];

    constructor()
    {
        this._users         = [];
        this._offlineUsers  = [];
    }

    public async init(): Promise<boolean>
    {
        Logger.writeLine(`UserManager -> Loaded`);
            
        return Promise.resolve(true);
    }

    public async getUser(userId: number, username?: string): Promise<User>
    {
        if(!userId && !username) return null;

        let result: User = null;

        const totalUsers        = this._users.length;
        const totalOfflineUsers = this._offlineUsers.length;

        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(user.userId === userId || user.username === username)
            {
                result = user;

                break;
            }
        }

        if(result) return Promise.resolve(result);

        for(let i = 0; i < totalOfflineUsers; i++)
        {
            const user = this._offlineUsers[i];

            if(user.userId === userId || user.username === username)
            {
                result = user;

                break;
            }
        }

        if(result) return Promise.resolve(result);

        if(!userId && username)
        {
            const findUser = await getManager().findOne(UserEntity, {
                select: ['id'],
                where: { username }
            });

            if(findUser) userId = findUser.id;
        }

        if(userId)
        {
            const user = new User(userId, null);
        
            await user.loadUser();

            this._offlineUsers.push(user);

            result = user;
        }
        
        return Promise.resolve(result);
    }

    public async searchUsers(username: string): Promise<User[]>
    {
        if(!username) return null;

        username = username.toLowerCase();

        let results: User[]     = [];
        let userIds: number[]   = [0];

        const totalUsers        = this._users.length;
        const totalOfflineUsers = this._offlineUsers.length;

        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(username.startsWith(user.username.toLowerCase()))
            {
                results.push(user);
                userIds.push(user.userId);
            }
        }

        for(let i = 0; i < totalOfflineUsers; i++)
        {
            const user = this._offlineUsers[i];

            if(username.startsWith(user.username.toLowerCase()))
            {
                results.push(user);
                userIds.push(user.userId);
            }
        }

        if(results.length < 50)
        {
            const dbResults = await getManager().find(UserEntity, {
                select: ['id'],
                where: { id: Not(In(userIds)), username: Like(`${ username }%`) },
                take: 50 - results.length
            });

            const totalDbResults = dbResults.length;

            if(totalDbResults)
            {
                for(let i = 0; i < totalDbResults; i++)
                {
                    const user = dbResults[i];

                    const newInstance = new User(user.id, null);

                    await newInstance.loadUser();

                    this._offlineUsers.push(newInstance);

                    results.push(newInstance);
                }
            }
        }
        
        return Promise.resolve(results);
    }

    public async addUser(user: User): Promise<boolean>
    {
        if(!(user instanceof User) || !user.client()) return Promise.reject(new Error('invalid_user'));
        
        const totalUsers        = this._users.length;
        const totalOfflineUsers = this._offlineUsers.length;

        for(let i = 0; i < totalOfflineUsers; i++)
        {
            const offlineUser = this._offlineUsers[i];

            if(offlineUser.userId === user.userId)
            {
                this._offlineUsers.splice(i, 1);

                break;
            }
        }

        for(let i = 0; i < totalUsers; i++)
        {
            const onlineUser = this._users[i];

            if(onlineUser.userId === user.userId)
            {
                await onlineUser.dispose();

                this._users.splice(i, 1);

                break;
            }
        }

        this._users.push(user);
        
        return Promise.resolve(true);
    }

    public async removeUser(userId: number): Promise<boolean>
    {
        const totalUsers = this._users.length;

        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(user.userId === userId)
            {
                await user.dispose();

                this._users.splice(i, 1);

                break;
            }
        }

        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        const totalUsers = this._users.length;

        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            await user.dispose();

            this._users.splice(i, 1);
        }

        this._offlineUsers = [];

        if(totalUsers > 0) return Promise.reject(new Error('user_manager_dispose_error'));

        Logger.writeLine(`UserManager -> Disposed`);

        return Promise.resolve(true);
    }
}