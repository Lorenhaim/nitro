import { getManager, Like } from 'typeorm';

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

        for(const user of this._users)
        {
            if(user.userId === userId || user.username === username)
            {
                result = user;

                break;
            }
        }

        if(result) return Promise.resolve(result);

        for(const user of this._offlineUsers)
        {
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
            const user = new User(null, userId);
        
            await user.loadUser();

            this._offlineUsers.push(user);

            result = user;
        }
        
        return result;
    }

    public async searchUsers(username: string): Promise<any[]>
    {
        if(!username) return null;

        username = username.toLowerCase();

        let results: User[] = [];

        for(const user of this._users) if(username.startsWith(user.username.toLowerCase())) results.push(user);

        for(const user of this._offlineUsers) if(username.startsWith(user.username.toLowerCase())) results.push(user);

        if(results.length < 50)
        {
            const users = await getManager().find(UserEntity, {
                select: ['id'],
                where: { username: Like(`${ username }%`) },
                take: 50 - results.length
            });

            if(users)
            {
                for(const user of users)
                {
                    const userInstance = new User(null, user.id);

                    await userInstance.loadUser();

                    this._offlineUsers.push(userInstance);

                    results.push(userInstance);
                }
            }
        }
        
        return results;
    }

    public async addUser(user: User): Promise<boolean>
    {
        if(!(user instanceof User) || !user.client()) return Promise.reject(new Error('invalid_user'));
        
        let result = false;

        for(const [index, offline] of this._offlineUsers.entries())
        {
            if(offline.userId === user.userId)
            {
                this._offlineUsers.splice(index, 1);

                break;
            }
        }

        for(const [index, existing] of this._users.entries())
        {
            if(existing.userId === user.userId)
            {
                result = true;

                await existing.dispose();

                this._users.splice(index, 1);

                this._users.push(user);

                break;
            }
        }

        if(!result) this._users.push(user);
        
        return Promise.resolve(true);
    }

    public async removeUser(userId: number): Promise<boolean>
    {
        for(const [index, existing] of this._users.entries())
        {
            if(existing.userId === userId)
            {
                await existing.dispose();

                this._users.splice(index, 1);

                break;
            }
        }

        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        for(const [index, existing] of this._users.entries())
        {
            await existing.dispose();

            this._users.splice(index, 1);
        }

        this._offlineUsers = [];

        if(this._users.length > 0) return Promise.reject(new Error('user_manager_dispose_error'));

        Logger.writeLine(`UserManager -> Disposed`);

        return Promise.resolve(true);
    }
}