import { Manager } from '../../../../common';
import { UserOutfitDao } from '../../../../database';
import { UnitGender } from '../../../unit';
import { User } from '../../User';
import { Outfit } from './Outfit';

export class UserOutfits extends Manager
{
    private _user: User;
    private _outfits: Outfit[];

    constructor(user: User)
    {
        super('UserOutfits', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user      = user;
        this._outfits   = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadOutfits();
    }

    protected async onDispose(): Promise<void>
    {
        this._outfits = [];
    }

    public async addOutfit(slotNumber: number, figure: string, gender: UnitGender): Promise<void>
    {
        if(!slotNumber || !figure || !gender) return;
        
        const result = await UserOutfitDao.addOutfit({
            userId: this._user.id,
            figure,
            gender,
            slotNumber
        });

        if(!result) return;
        
        const totalOutfits = this._outfits.length;

        if(totalOutfits)
        {
            for(let i = 0; i < totalOutfits; i++)
            {
                const existingOutfit = this._outfits[i];

                if(!existingOutfit) continue;

                if(existingOutfit.slotNumber !== slotNumber) continue;
                
                this._outfits.splice(i, 1);

                break;
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

    private async loadOutfits(): Promise<void>
    {
        this._outfits = [];

        const results = await UserOutfitDao.loadUserOutfits(this._user.id);

        if(!results) return;
        
        const totalResults = results.length;

        if(!totalResults) return;
        
        for(let i = 0; i < totalResults; i++)
        {
            const outfit = results[i];

            if(!outfit) continue;

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

    public get user(): User
    {
        return this._user;
    }

    public get outfits(): Outfit[]
    {
        return this._outfits;
    }
}