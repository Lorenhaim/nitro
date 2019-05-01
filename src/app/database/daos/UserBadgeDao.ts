import { getManager, In, Not } from 'typeorm';
import { UserBadgeEntity } from '../entities';

export class UserBadgeDao
{
    public static async loadUserBadges(userId: number): Promise<UserBadgeEntity[]>
    {
        if(userId)
        {
            const results = await getManager().find(UserBadgeEntity, {
                where: { userId }
            });

            if(results.length) return results;
        }

        return null;
    }

    public static async loadOneUserBadge(userId: number, badgeCode: string): Promise<UserBadgeEntity>
    {
        if(userId && badgeCode)
        {
            const result = await getManager().findOne(UserBadgeEntity, {
                where: { userId, badgeCode }
            });

            if(result) return result;
        }

        return null;
    }

    public static async loadUserCurrentBadges(userId: number): Promise<UserBadgeEntity[]>
    {
        if(userId)
        {
            const results = await getManager().find(UserBadgeEntity, {
                where: {
                    userId,
                    slotNumber: Not(0)
                },
                take: 5
            });

            if(results.length) return results;
        }

        return null;
    }

    public static async addBadge(userId: number, ...badgeCodes: string[]): Promise<UserBadgeEntity[]>
    {
        const codes                             = [ ...badgeCodes ];
        const addedBadges: UserBadgeEntity[]    = [];

        if(userId && codes)
        {
            const totalCodes = codes.length;

            if(totalCodes)
            {
                for(let i = 0; i < totalCodes; i++)
                {
                    const code = codes[i];

                    const entity = new UserBadgeEntity();

                    entity.userId       = userId;
                    entity.badgeCode    = code;

                    addedBadges.push(entity);
                }
            }

            if(addedBadges.length)
            {
                await getManager().save(addedBadges);
                
                return addedBadges;
            }
        }

        return null;
    }

    public static async removeBadge(userId: number, ...badgeCodes: string[]): Promise<void>
    {
        const codes = [ ...badgeCodes ];
        
        if(userId && codes)
        {
            const totalCodes = codes.length;

            if(totalCodes)
            {
                await getManager().delete(UserBadgeEntity, {
                    userId,
                    badgeCode: In(codes)
                });
            }
        }
    }

    public static async setBadgeSlot(userId: number, badgeCode: string, slotNumber: 0 | 1 | 2 | 3 | 4 | 5): Promise<void>
    {
        if(userId && badgeCode && slotNumber > 0)
        {
            await getManager().update(UserBadgeEntity, {
                userId,
                badgeCode
            }, {
                slotNumber
            });
        }
    }

    public static async resetBadgeSlots(userId: number): Promise<void>
    {
        if(userId) await getManager().update(UserBadgeEntity, {
            userId
        }, {
            slotNumber: 0
        });
    }
}