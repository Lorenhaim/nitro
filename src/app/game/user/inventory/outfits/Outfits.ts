import { getManager, Not } from 'typeorm';

import { UserOutfitEntity } from '../../../../common';

import { User } from '../../User';
import { Outfit } from './Outfit';

export class Outfits
{
    private _outfits: Outfit[];

    private _isLoaded: boolean;
    private _isDisposed: boolean;

    constructor(private readonly _user: User)
    {
        if(!(_user instanceof User) || !_user.userId) throw new Error('invalid_user');
        
        this._outfits = [];

        this._isLoaded      = false;
        this._isDisposed    = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded)
        {
            await this.loadOutfits();

            this._isLoaded = true;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed)
        {
            this._outfits = [];

            this._isLoaded      = false;
            this._isDisposed    = true;
        }
    }

    public async getOutfit(outfitId: number): Promise<Outfit>
    {
        let result: Outfit = null;

        if(outfitId)
        {
            if(this._isLoaded)
            {
                const totalOutfits = this._outfits.length;

                for(let i = 0; i < totalOutfits; i++)
                {
                    const outfit = this._outfits[i];

                    if(outfit.id === outfitId)
                    {
                        result = outfit;

                        break;
                    }
                }
            }
            else
            {
                const dbResult = await getManager().findOne(UserOutfitEntity, {
                    where: {
                        id: outfitId,
                        userId: this._user.userId
                    }
                });

                if(dbResult) result = {
                    id: dbResult.id,
                    userId: this._user.userId,
                    figure: dbResult.figure
                };
            }
        }

        return Promise.resolve(result);
    }

    private async loadOutfits(): Promise<void>
    {
        if(!this._isLoaded)
        {
            this._outfits = [];

            const results = await getManager().find(UserOutfitEntity, {
                where: {
                    userId: this._user.userId
                }
            });

            const totalResults = results.length;

            for(let i = 0; i < totalResults; i++)
            {
                const outfit = results[i];

                this._outfits.push({
                    id: outfit.id,
                    userId: outfit.userId,
                    figure: outfit.figure
                });
            }
        }
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