import { Manager } from '../../../common';
import { SecurityRankDao } from '../../../database';
import { Rank } from './Rank';

export class RankManager extends Manager
{
    private _ranks: Rank[];
    
    constructor()
    {
        super('RankManager');
    }

    protected async onInit(): Promise<void>
    {
        await this.loadRanks();
    }

    protected async onDispose(): Promise<void>
    {
        this._ranks = [];
    }

    private async loadRanks(): Promise<void>
    {
        this._ranks = [];

        const results = await SecurityRankDao.loadRanks();

        if(results)
        {
            const totalResults = results.length;
            
            if(totalResults) for(let i = 0; i < totalResults; i++) this._ranks.push(new Rank(results[i]));
        }

        this.logger.log(`Loaded ${ this._ranks.length } ranks`);
    }

    public getRank(rankId: number): Rank
    {
        const totalRanks = this._ranks.length;

        if(totalRanks)
        {
            for(let i = 0; i < totalRanks; i++)
            {
                const rank = this._ranks[i];

                if(rank.id === rankId) return rank;
            }
        }

        return null;
    }
}