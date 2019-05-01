import { getManager } from 'typeorm';
import { SecurityRankEntity } from '../entities';

export class SecurityRankDao
{
    public static async loadRanks(): Promise<SecurityRankEntity[]>
    {
        const results = await getManager().find(SecurityRankEntity);

        if(results !== null) return results;

        return null;
    }
}