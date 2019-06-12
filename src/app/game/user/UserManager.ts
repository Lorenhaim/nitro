import { Manager } from '../../common/interfaces/Manager';
import { UserDao, UserEntity } from '../../database';
import { Outgoing } from '../../packets';
import { User } from './User';

export class UserManager extends Manager
{
    private _users: User[];

    constructor()
    {
        super('UserManager');

        this._users = [];
    }

    protected async onInit(): Promise<void> {}

    protected async onDispose(): Promise<void>
    {
        const totalUsers = this._users.length;

        if(!totalUsers) return;

        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users.shift();

            if(!user) continue;

            await user.dispose();
        }
    }

    public getUserById(id: number): User
    {
        if(!id) return null;

        const totalUsers = this._users.length;

        if(!totalUsers) return null;
        
        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(!user) continue;

            if(user.id === id) return user;
        }

        return null;
    }

    public getUserByUsername(username: string): User
    {
        if(!username) return null;

        username = username.toLocaleLowerCase();

        const totalUsers = this._users.length;

        if(!totalUsers) return null;
        
        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(!user) continue;

            if(user.details.username.toLocaleLowerCase() === username) return user;
        }

        return null;
    }

    public async getOfflineUserById(id: number): Promise<User>
    {
        if(!id) return null;

        const activeUser = this.getUserById(id);

        if(activeUser) return activeUser;

        const entity = await UserDao.getUserById(id);

        if(!entity) return null;

        const newUser = new User(entity);

        if(!newUser) return null;

        return newUser;
    }

    public async getOfflineUserByUsername(username: string): Promise<User>
    {
        if(!username) return null;

        const activeUser = this.getUserByUsername(username);

        if(activeUser) return activeUser;

        const entity = await UserDao.getUserByUsername(username);

        if(!entity) return null;

        const newUser = new User(entity);

        if(!newUser) return null;

        return newUser;
    }

    public processOutgoing(...outgoing: Outgoing[]): void
    {
        const totalUsers = this._users.length;

        if(!totalUsers) return;
        
        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(!user || !user.connections) continue;
            
            user.connections.processOutgoing(...outgoing);
        }
    }

    public async searchUsersByUsername(username: string): Promise<UserEntity[]>
    {
        if(!username) return null;

        const results = await UserDao.searchUsersByUsername(username);

        if(!results || !results.length) return null;

        return results;
    }

    public async addUser(user: User): Promise<void>
    {
        if(!(user instanceof User)) return;

        await this.removeUser(user.id);
        
        this._users.push(user);
    }

    public async removeUser(id: number): Promise<void>
    {
        const totalUsers = this._users.length;

        if(!totalUsers) return;

        for(let i = 0; i < totalUsers; i++)
        {
            const user = this._users[i];

            if(!user) continue;

            if(user.id !== id) continue;
            
            await user.dispose();

            this._users.splice(i, 1);
            
            return;
        }
    }

    public get users(): User[]
    {
        return this._users;
    }
}