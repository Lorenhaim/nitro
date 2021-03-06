import { Manager } from '../../../common';
import { User } from '../User';
import { UserBadges } from './badges';
import { UserBots } from './bots';
import { UserClothing, UserOutfits } from './clothing';
import { UserCurrency } from './currency/UserCurrency';
import { UserEffects } from './effects';
import { UserGroups } from './groups';
import { UserItems } from './items';
import { UserPets } from './pets';
import { UserRooms } from './rooms';

export class UserInventory extends Manager
{
    private _user: User;

    private _badges: UserBadges;
    private _bots: UserBots;
    private _clothing: UserClothing;
    private _outfits: UserOutfits;
    private _currency: UserCurrency;
    private _effects: UserEffects;
    private _groups: UserGroups;
    private _items: UserItems;
    private _pets: UserPets;
    private _rooms: UserRooms;

    constructor(user: User)
    {
        super('UserInventory', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;

        this._badges        = new UserBadges(user);
        this._bots          = new UserBots(user);
        this._clothing      = new UserClothing(user);
        this._outfits       = new UserOutfits(user);
        this._currency      = new UserCurrency(user);
        this._effects       = new UserEffects(user);
        this._groups        = new UserGroups(user);
        this._items         = new UserItems(user);
        this._pets          = new UserPets(user);
        this._rooms         = new UserRooms(user);
    }

    protected async onInit(): Promise<void>
    {
        await this._badges.init();
        await this._bots.init();
        await this._clothing.init();
        await this._outfits.init();
        await this._currency.init();
        await this._effects.init();
        await this._groups.init();
        await this._items.init();
        await this._pets.init();
        await this._rooms.init();
    }

    protected async onDispose(): Promise<void>
    {
        await this._badges.dispose();
        await this._bots.dispose();
        await this._clothing.dispose();
        await this._outfits.dispose();
        await this._currency.dispose();
        await this._effects.dispose();
        await this._groups.dispose();
        await this._items.dispose();
        await this._pets.dispose();
        await this._rooms.dispose();
    }

    public get user(): User
    {
        return this._user;
    }

    public get badges(): UserBadges
    {
        return this._badges;
    }

    public get bots(): UserBots
    {
        return this._bots;
    }

    public get clothing(): UserClothing
    {
        return this._clothing;
    }

    public get outfits(): UserOutfits
    {
        return this._outfits;
    }

    public get currency(): UserCurrency
    {
        return this._currency;
    }

    public get effects(): UserEffects
    {
        return this._effects;
    }

    public get groups(): UserGroups
    {
        return this._groups;
    }

    public get items(): UserItems
    {
        return this._items;
    }

    public get pets(): UserPets
    {
        return this._pets;
    }

    public get rooms(): UserRooms
    {
        return this._rooms;
    }
}