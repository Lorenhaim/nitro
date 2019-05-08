import { Manager } from '../../../common';
import { User } from '../User';
import { UserBadges } from './badges';
import { UserBots } from './bots';
import { UserCurrency } from './currency/UserCurrency';
import { UserItems } from './items';
import { UserOutfits } from './outfits';
import { UserPets } from './pets';

export class UserInventory extends Manager
{
    private _user: User;

    private _badges: UserBadges;
    private _bots: UserBots;
    private _currencies: UserCurrency;
    private _items: UserItems;
    private _outfits: UserOutfits;
    private _pets: UserPets;

    constructor(user: User)
    {
        super('UserInventory', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;

        this._badges        = new UserBadges(user);
        this._bots          = new UserBots(user);
        this._currencies    = new UserCurrency(user);
        this._items         = new UserItems(user);
        this._outfits       = new UserOutfits(user);
        this._pets          = new UserPets(user);

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    protected async onInit(): Promise<void>
    {
        await this._badges.init();
        await this._bots.init();
        await this._currencies.init();
        await this._items.init();
        await this._outfits.init();
        await this._pets.init();
    }

    protected async onDispose(): Promise<void>
    {
        await this._badges.dispose();
        await this._bots.dispose();
        await this._currencies.dispose();
        await this._items.dispose();
        await this._outfits.dispose();
        await this._pets.dispose();
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

    public get currencies(): UserCurrency
    {
        return this._currencies;
    }

    public get items(): UserItems
    {
        return this._items;
    }

    public get outfits(): UserOutfits
    {
        return this._outfits;
    }

    public get pets(): UserPets
    {
        return this._pets;
    }
}