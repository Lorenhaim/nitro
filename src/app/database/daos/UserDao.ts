import { getManager, Like } from 'typeorm';
import { UserEntity } from '../../database';

export class UserDao
{
    public static async getIdByUsername(username: string): Promise<number>
    {
        if(!username) return null;
        
        const result = await getManager().findOne(UserEntity, {
            select: ['id', 'username'],
            where: { username }
        });

        if(!result) return null;

        return result.id;
    }

    public static async getUsernameById(id: number): Promise<string>
    {
        if(!id) return null;
        
        const result = await getManager().findOne(UserEntity, {
            select: ['id', 'username'],
            where: { id }
        });

        if(!result) return null;

        return result.username;
    }

    public static async getUserById(id: number): Promise<UserEntity>
    {
        if(!id) return null;

        const result = await getManager().findOne(UserEntity, id, {
            relations: ['info', 'statistics']
        });

        if(!result) return null;

        return result;
    }

    public static async getUserByUsername(username: string): Promise<UserEntity>
    {
        if(!username) return null;

        const result = await getManager().findOne(UserEntity, {
            where: { username },
            relations: ['info', 'statistics']
        });

        if(!result) return null;

        return result;
    }

    public static async getLoginByUsername(username: string): Promise<{ id: number, username: string, password: string }>
    {
        if(!username) return null;
        
        const result = await getManager().findOne(UserEntity, {
            select: ['id', 'username', 'password'],
            where: { username }
        });

        if(!result) return null;

        return result;
    }
    
    public static async validateUsername(username: string): Promise<boolean>
    {
        if(!username) return false;
        
        const regex = new RegExp(/^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{1,20}$/g);

        if(!regex.test(username)) return false;
        
        const result = await getManager().findOne(UserEntity, {
            select: ['id', 'username'],
            where: { username }
        });

        if(result) return false;

        return true;
    }

    public static async validateEmail(email: string): Promise<boolean>
    {
        if(!email) return false;
        
        const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);

        if(!regex.test(email)) return false;
        
        const result = await getManager().findOne(UserEntity, {
            select: ['id', 'email'],
            where: { email }
        });

        if(result) return false;

        return true;
    }

    public static async searchUsersByUsername(username: string): Promise<UserEntity[]>
    {
        if(!username) return null;

        const results = await getManager().find(UserEntity, {
            select: ['id', 'username', 'motto', 'figure', 'online'],
            where: {
                username: Like(username + '%')
            },
            take: 20
        });

        if(!results.length) return null;

        return results;
    }
}