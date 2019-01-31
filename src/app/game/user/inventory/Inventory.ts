import { User } from '../User';
import { Badges } from './badges';
import { Outfits, Outfit } from './outfits';

export class Inventory
{
    private _badges: Badges;
    private _outfits: Outfits;

    private _isLoaded: boolean;
    private _isDisposed: boolean;

    constructor(_user: User)
    {
        if(!(_user instanceof User) || !_user.userId) throw new Error('invalid_user');

        this._badges    = new Badges(_user);
        this._outfits   = new Outfits(_user);

        this._isLoaded      = false;
        this._isDisposed    = false;
    }
    
    public async init(): Promise<void>
    {
        if(!this._isLoaded)
        {
            await this._badges.init();
            await this._outfits.init();

            this._isLoaded = true;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed)
        {
            await this._badges.dispose();
            await this._outfits.dispose();

            this._isLoaded      = false;
            this._isDisposed    = true;
        }
    }

    public badges(): Badges
    {
        return this._badges;
    }

    public outfits(): Outfits
    {
        return this._outfits;
    }

    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }
}