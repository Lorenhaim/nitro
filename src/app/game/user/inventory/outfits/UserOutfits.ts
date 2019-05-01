import { UserOutfitDao } from '../../../../database';
import { User } from '../../User';
import { Outfit } from './Outfit';

export class UserOutfits
{
    private _user: User;

    private _outfits: Outfit[];

    private _isLoaded: boolean;
    private _isLoading: boolean;

    private _isDisposed: boolean;
    private _isDisposing: boolean;

    constructor(user: User)
    {
        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;
        
        this._outfits       = [];

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

            await this.loadOutfits();

            this._isLoaded  = true;
            this._isLoading = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed && !this._isDisposing)
        {
            this._isDisposing   = true;

            this._outfits       = [];

            this._isDisposed    = true;
            this._isDisposing   = false;
            this._isLoaded      = false;
        }
    }

    public async addOutfit(slotNumber: number, figure: string, gender: 'M' | 'F'): Promise<void>
    {
        if(slotNumber && figure && gender)
        {
            const result = await UserOutfitDao.addOutfit({
                userId: this._user.id,
                figure,
                gender,
                slotNumber
            });
                
            const totalOutfits = this._outfits.length;

            if(totalOutfits)
            {
                for(let i = 0; i < totalOutfits; i++)
                {
                    const existingOutfit = this._outfits[i];

                    if(existingOutfit.slotNumber === slotNumber) this._outfits.splice(i, 1);
                }
            }
            
            this._outfits.push({
                id: result.id,
                userId: result.userId,
                figure: result.figure,
                gender: result.gender,
                slotNumber: result.slotNumber
            });
        }
    }

    private async loadOutfits(): Promise<void>
    {
        if(!this._isLoaded)
        {
            this._isLoading = true;

            this._outfits = [];

            const results = await UserOutfitDao.loadUserOutfits(this._user.id);

            if(results)
            {
                const totalResults = results.length;

                if(totalResults)
                {
                    for(let i = 0; i < totalResults; i++)
                    {
                        const outfit = results[i];

                        const existingOutfit: Outfit = {
                            id: outfit.id,
                            userId: outfit.userId,
                            figure: outfit.figure,
                            gender: outfit.gender,
                            slotNumber: outfit.slotNumber
                        };

                        this._outfits.push(existingOutfit);
                    }
                }
            }
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get outfits(): Outfit[]
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