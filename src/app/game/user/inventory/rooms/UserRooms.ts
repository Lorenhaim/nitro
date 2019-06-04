import { getManager } from 'typeorm';
import { Manager } from '../../../../common';
import { UserDao, UserFavoriteRoomEntity, UserLikedRoomEntity } from '../../../../database';
import { Emulator } from '../../../../Emulator';
import { RoomScoreComposer, UserFavoriteRoomComposer } from '../../../../packets';
import { User } from '../../User';

export class UserRooms extends Manager
{
    private _user: User;

    private _favoritedRoomIds: number[];

    private _likedRoomIds: number[];

    constructor(user: User)
    {
        super('UserRooms', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user              = user;

        this._favoritedRoomIds  = [];
        this._likedRoomIds      = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadFavoritedRooms();
        await this.loadLikedRooms();
    }

    protected async onDispose(): Promise<void>
    {
        this._favoritedRoomIds  = [];
        this._likedRoomIds      = [];
    }

    public hasFavorited(roomId: number): boolean
    {
        return this._favoritedRoomIds.indexOf(roomId) !== -1;
    }

    public hasLiked(roomId: number): boolean
    {
        return this._likedRoomIds.indexOf(roomId) !== -1;
    }

    public async likeRoom(roomId: number): Promise<void>
    {
        if(!roomId) return;

        if(this.hasLiked(roomId)) return;

        const entity = new UserLikedRoomEntity();

        entity.userId   = this._user.id;
        entity.roomId   = roomId;

        await getManager().save(entity);

        this._likedRoomIds.push(roomId);

        const room = Emulator.gameManager.roomManager.getActiveRoom(roomId);

        if(!room) return;

        room.details.totalLikes++;

        if(this._user.unit.room && this._user.unit.room === room) this._user.connections.processOutgoing(new RoomScoreComposer(room));
    }

    public async favoriteRoom(roomId: number): Promise<void>
    {
        if(!roomId) return;

        if(this.hasFavorited(roomId)) return;

        const entity = new UserFavoriteRoomEntity();

        entity.userId   = this._user.id;
        entity.roomId   = roomId;

        await getManager().save(entity);

        this._favoritedRoomIds.push(roomId);

        this._user.connections.processOutgoing(new UserFavoriteRoomComposer(roomId, true));
    }

    public async unfavoriteRoom(roomId: number): Promise<void>
    {
        if(!roomId) return;

        if(!this.hasFavorited(roomId)) return;

        const index = this._favoritedRoomIds.indexOf(roomId);

        if(index === -1) return;

        this._favoritedRoomIds.splice(index, 1);

        await getManager().delete(UserFavoriteRoomEntity, {
            userId: this._user.id,
            roomId
        });

        this._user.connections.processOutgoing(new UserFavoriteRoomComposer(roomId, false));
    }

    private async loadFavoritedRooms(): Promise<void>
    {
        this._favoritedRoomIds = [];

        const results = await UserDao.getFavoritedRoomIdsByUserId(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;

        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._favoritedRoomIds.push(result.roomId);
        }
    }

    private async loadLikedRooms(): Promise<void>
    {
        this._likedRoomIds = [];

        const results = await UserDao.getLikedRoomIdsByUserId(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;

        for(let i = 0; i < totalResults; i++)
        {
            const result = results[i];

            if(!result) continue;

            this._likedRoomIds.push(result.roomId);
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get favoritedRoomIds(): number[]
    {
        return this._favoritedRoomIds;
    }

    public get likedRoomIds(): number[]
    {
        return this._likedRoomIds;
    }
}