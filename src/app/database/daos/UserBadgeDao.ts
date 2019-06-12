import { getManager, In, Not } from 'typeorm';
import { BadgeSlot } from '../../game';
import { UserBadgeEntity } from '../entities';

export class UserBadgeDao
{
    public static async loadUserBadges(userId: number): Promise<UserBadgeEntity[]>
    {
        if(!userId) return null;
        
        const results = await getManager().find(UserBadgeEntity, {
            where: { userId }
        });

        if(!results.length) return null;

        return results;
    }

    public static async loadOneUserBadge(userId: number, badgeCode: string): Promise<UserBadgeEntity>
    {
        if(!userId || !badgeCode) return null;
        
        const result = await getManager().findOne(UserBadgeEntity, {
            where: { userId, badgeCode }
        });

        if(!result) return null;
        
        return result;
    }

    public static async loadUserCurrentBadges(userId: number): Promise<UserBadgeEntity[]>
    {
        if(!userId) return null;
        
        const results = await getManager().find(UserBadgeEntity, {
            where: {
                userId,
                slotNumber: Not(0)
            },
            take: 5
        });
        
        if(!results.length) return null;

        return results;
    }

    public static async addBadge(userId: number, ...badgeCodes: string[]): Promise<UserBadgeEntity[]>
    {
        if(!userId) return null;

        const codes                             = [ ...badgeCodes ];
        const addedBadges: UserBadgeEntity[]    = [];

        if(!codes) return null;
        
        const totalCodes = codes.length;

        if(!totalCodes) return null;
        
        for(let i = 0; i < totalCodes; i++)
        {
            const badgeCode = codes[i];

            if(!badgeCode) continue;

            const result = await this.loadOneUserBadge(userId, badgeCode);

            if(result) continue;

            const entity = new UserBadgeEntity();

            entity.userId       = userId;
            entity.badgeCode    = badgeCode;

            addedBadges.push(entity);
        }

        if(!addedBadges.length) return null;
        
        return await getManager().save(addedBadges);
    }

    public static async removeBadge(userId: number, ...badgeCodes: string[]): Promise<void>
    {
        if(!userId) return;

        const codes = [ ...badgeCodes ];

        if(!codes) return;
        
        const totalCodes = codes.length;

        if(!totalCodes) return;
        
        await getManager().delete(UserBadgeEntity, {
            userId,
            badgeCode: In(codes)
        });
    }

    public static async setBadgeSlot(userId: number, badgeCode: string, slotNumber: BadgeSlot): Promise<void>
    {
        if(!userId || !badgeCode || !slotNumber) return;

        await getManager().update(UserBadgeEntity, {
            userId,
            badgeCode
        }, {
            slotNumber
        });
    }

    public static async resetBadgeSlots(userId: number): Promise<void>
    {
        if(!userId) return;
        
        await getManager().update(UserBadgeEntity, {
            userId
        }, {
            slotNumber: 0
        });
    }
}