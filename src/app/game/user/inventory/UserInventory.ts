import { User } from '../User';
import { UserBadges } from './badges';
import { UserCurrency } from './currency/UserCurrency';
import { UserItems } from './items';
import { UserOutfits } from './outfits';
import { UserPets } from './pets';

export class UserInventory
{
    private _user: User;

    private _badges: UserBadges;
    private _currencies: UserCurrency;
    private _items: UserItems;
    private _outfits: UserOutfits;
    private _pets: UserPets;

    protected _isLoaded: boolean;
    protected _isLoading: boolean;

    protected _isDisposed: boolean;
    protected _isDisposing: boolean;

    constructor(user: User)
    {
        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;

        this._badges        = new UserBadges(user);
        this._currencies    = new UserCurrency(user);
        this._items         = new UserItems(user);
        this._outfits       = new UserOutfits(user);
        this._pets          = new UserPets(user);

        this._isLoaded      = false;
        this._isLoading     = false;

        this._isDisposed    = false;
        this._isDisposing   = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded && !this._isLoading)
        {
            this._isLoading = true;

            await this._badges.init();
            await this._currencies.init();
            await this._items.init();
            await this._outfits.init();
            await this._pets.init();

            this._isLoaded   = true;
            this._isLoading  = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing = true;

            await this._badges.dispose();
            await this._currencies.dispose();
            await this._items.dispose();
            await this._outfits.dispose();
            await this._pets.dispose();

            this._isDisposed    = true;
            this._isDisposing   = false;
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get badges(): UserBadges
    {
        return this._badges;
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