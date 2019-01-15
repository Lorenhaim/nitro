import { Emulator } from '../../Emulator';
import { Logger } from '../../common';

import { User } from './User';

export class UserManager
{
    private _users: User[];

    constructor()
    {
        this._users = [];
    }

    public async init(): Promise<boolean>
    {
        Logger.writeLine(`UserManager -> Loaded`);
            
        return Promise.resolve(true);
    }

    public getUser(userId: number, username?: string): User
    {
        if(!userId && !username) return null;

        let result = null;

        for(const user of this._users)
        {
            if(user.userId === userId || user.username === username)
            {
                result = user;

                break;
            }
        }

        return result;
    }

    public async addUser(user: User): Promise<boolean>
    {
        if(!(user instanceof User)) return Promise.reject(new Error('invalid_user'));
        
        let result = false;

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