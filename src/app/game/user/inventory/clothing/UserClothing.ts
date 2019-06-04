import { Manager } from '../../../../common';
import { UserClothingDao } from '../../../../database';
import { GenericNotificationListComposer, UserClothingComposer } from '../../../../packets';
import { NotificationList, NotificationType } from '../../../notification';
import { User } from '../../User';

export class UserClothing extends Manager
{
    private _user: User;

    private _clothingIds: number[];

    constructor(user: User)
    {
        super('UserClothing', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;

        this._clothingIds   = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadClothing();
    }

    protected async onDispose(): Promise<void>
    {
        this._clothingIds = [];
    }

    public hasClothing(clothingId: number): boolean
    {
        return this._clothingIds.indexOf(clothingId) !== -1;
    }

    public async addClothing(...clothingIds: number[]): Promise<void>
    {
        const addedClothing = [ ...clothingIds ];

        if(!addedClothing) return;
        
        const totalClothing = addedClothing.length;

        if(!totalClothing) return;
        
        for(let i = 0; i < totalClothing; i++)
        {
            const id = addedClothing[i];

            if(!id) continue;

            if(this.hasClothing(id)) continue;

            await UserClothingDao.addUserClothing(this._user.id, id);

            this._clothingIds.push(id);
        }

        this._user.connections.processOutgoing(new UserClothingComposer(), new GenericNotificationListComposer(new NotificationList(NotificationType.CLOTHING_REDEEMED).quickMessage()));
    }

    private async loadClothing(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._clothingIds = [];

        const results = await UserClothingDao.loadUserClothing(this._user.id);

        if(!results) return;

        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const clothing = results[i];

            if(this.hasClothing(clothing.clothingId)) continue;

            this._clothingIds.push(clothing.clothingId);
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get clothingIds(): number[]
    {
        return this._clothingIds;
    }
}