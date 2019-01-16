import { Logger } from '../../common';

import { User } from './User';
import { UserOffline } from './UserOffline';

export class UserManager
{
    private _users: User[];
    private _offlineUsers: UserOffline[];

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

    public async getUser(userId: number, username?: string): Promise<User | UserOffline>
    {
        if(!userId && !username) return null;

        let result: User | UserOffline = null;

        for(const user of this._users)
        {
            if(user.userId === userId || user.username === username)
            {
                result = user;

                break;
            }
        }

        if(!result)
        {
            for(const user of this._offlineUsers)
            {
                if(user.userId === userId || user.username === username)
                {
                    result = user;

                    break;
                }
            }
        }

        if(!result)
        {
            const offlineUser = new UserOffline(userId);
            
            await offlineUser.loadUser();

            if(offlineUser.isLoaded)
            {
                this._offlineUsers.push(offlineUser);

                result = offlineUser;
            }
        }
        
        return result;
    }

    public async addUser(user: User): Promise<boolean>
    {
        if(!(user instanceof User)) return Promise.reject(new Error('invalid_user'));
        
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

        if(this._users.length > 0) return Promise.reject(new Error('user_manager_dispose_error'));

        Logger.writeLine(`UserManager -> Disposed`);

        return Promise.resolve(true);
    }
}