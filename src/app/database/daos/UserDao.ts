import { getManager, Like } from 'typeorm';
import { UserEntity } from '../../database';
import { RoomEntity, UserFavoriteRoomEntity, UserLikedRoomEntity } from '../entities';

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

        const result = await getManager()
            .createQueryBuilder(UserEntity, 'user')
            .select(['user', 'info', 'statistics'])
            .where('user.id = :id', { id })
            .innerJoin('user.info', 'info')
            .innerJoin('user.statistics', 'statistics')
            .loadRelationCountAndMap('user.totalFriends', 'user.messengerFriends')
            .getOne();

        if(!result) return null;

        return result;
    }

    public static async getFavoritedRoomIdsByUserId(id: number): Promise<UserFavoriteRoomEntity[]>
    {
        if(!id) return null;

        const results = await getManager()
            .createQueryBuilder(UserFavoriteRoomEntity, 'favorite')
            .select(['favorite.id', 'favorite.roomId'])
            .where('favorite.userId = :id', { id })
            .getMany();

        if(!results.length) return null;

        return results;
    }

    public static async getOwnedRoomsWithoutGroups(ownerId: number): Promise<RoomEntity[]>
    {
        if(!ownerId) return null;

        const results = await getManager()
            .createQueryBuilder(RoomEntity, 'room')
            .select(['room.id', 'room.name', 'group.id' ])
            .where('room.ownerId = :ownerId', { ownerId })
            .andWhere('group.roomId IS NULL')
            .leftJoin('room.group', 'group')
            .getMany();

        if(!results.length) return null;

        return results;
    }

    public static async getLikedRoomIdsByUserId(id: number): Promise<UserLikedRoomEntity[]>
    {
        if(!id) return null;

        const results = await getManager()
            .createQueryBuilder(UserLikedRoomEntity, 'liked')
            .select(['liked.id', 'liked.roomId'])
            .where('liked.userId = :id', { id })
            .getMany();

        if(!results.length) return null;

        return results;
    }

    public static async getUserByUsername(username: string): Promise<UserEntity>
    {
        if(!username) return null;

        const result = await getManager()
            .createQueryBuilder(UserEntity, 'user')
            .select(['user'])
            .where('user.username = :username', { username })
            .innerJoin('user.info', 'info')
            .innerJoin('user.statistics', 'statistics')
            .loadRelationCountAndMap('user.totalFriends', 'user.messengerFriends')
            .getOne();

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