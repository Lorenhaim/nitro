import { getManager, Not } from 'typeorm';

import { UserBadgeEntity } from '../../../../common';
import { BadgesAddComposer, BadgesComposer } from '../../../../packets';

import { User } from '../../User';
import { Badge } from './Badge';

export class Badges
{
    private _badges: Badge[];
    private _currentBadges: Badge[];

    private _isLoaded: boolean;
    private _isDisposed: boolean;

    constructor(private readonly _user: User)
    {
        if(!(_user instanceof User) || !_user.userId) throw new Error('invalid_user');
        
        this._badges        = [];
        this._currentBadges = [];

        this._isLoaded      = false;
        this._isDisposed    = false;
    }

    public async init(): Promise<void>
    {
        if(!this._isLoaded)
        {
            await this.loadBadges();

            this._isLoaded = true;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed)
        {
            this._badges        = [];
            this._currentBadges = [];

            this._isLoaded      = false;
            this._isDisposed    = true;
        }
    }

    public async hasBadge(badgeCode: string): Promise<boolean>
    {
        let result = false;

        if(badgeCode)
        {
            if(this._isLoaded)
            {
                const totalBadges = this._badges.length;

                for(let i = 0; i < totalBadges; i++)
                {
                    const badge = this._badges[i];

                    if(badge.badgeCode === badgeCode)
                    {
                        result = true;

                        break;
                    }
                }
            }
            else
            {
                const dbResult = await getManager().findOne(UserBadgeEntity, {
                    where: {
                        userId: this._user.userId,
                        badgeCode: badgeCode
                    }
                });

                if(dbResult) result = true;
            }
        }

        return Promise.resolve(result);
    }

    public async getCurrentBadges(): Promise<Badge[]>
    {
        if(this._isLoaded)
        {
            return Promise.resolve(this._currentBadges);
        }
        else
        {
            const results: Badge[] = [];

            const dbResults = await getManager().find(UserBadgeEntity, {
                where: {
                    userId: this._user.userId,
                    slotNumber: Not('0')
                },
                take: 5
            });

            const totalDbResults = dbResults.length;

            if(dbResults && totalDbResults)
            {
                for(let i = 0; i < totalDbResults; i++)
                {
                    const badge = dbResults[i];
                    
                    results.push({
                        id: badge.id,
                        userId: badge.userId,
                        badgeCode: badge.badgeCode,
                        slotNumber: <any> parseInt(<any> badge.slotNumber)
                    });
                }
            }

            return Promise.resolve(results);
        }
    }

    public async addBadge(badgeCodes: string[]): Promise<void>
    {
        const totalToAdd = badgeCodes.length;

        if(badgeCodes && totalToAdd)
        {
            for(let i = 0; i < totalToAdd; i++)
            {
                const badgeCode = badgeCodes[i];

                if(!(await this.hasBadge(badgeCode)))
                {
                    const result = await getManager().insert(UserBadgeEntity, {
                        userId: this._user.userId,
                        badgeCode: badgeCode
                    });

                    if(result)
                    {
                        if(this._isLoaded)
                        {
                            const newBadge: Badge = {
                                id: result.generatedMaps[0].id,
                                userId: result.generatedMaps[0].userId,
                                badgeCode: result.generatedMaps[0].badgeCode,
                                slotNumber: <any> parseInt(result.generatedMaps[0].slotNumber)
                            };
        
                            this._badges.push(newBadge);

                            if(this._user.isAuthenticated && this._user.client()) await this._user.client().processComposer(new BadgesAddComposer(this._user, newBadge));
                        }
                    }
                }
            }
        }
    }

    public async removeBadge(badgeCodes: string[]): Promise<void>
    {
        const totalToRemove         = badgeCodes.length;
        const totalBadges           = this._isLoaded ? this._badges.length : null;
        const totalCurrentBadges    = this._isLoaded ? this._currentBadges.length : null;

        if(badgeCodes && totalToRemove)
        {
            for(let i = 0; i < totalToRemove; i++)
            {
                const badgeCode = badgeCodes[i];

                const result = await getManager().delete(UserBadgeEntity, {
                    userId: this._user.userId,
                    badgeCode: badgeCode
                });

                if(result.affected > 0)
                {
                    if(this._isLoaded)
                    {
                        for(let j = 0; j < totalBadges; j++)
                        {
                            const badge = this._badges[j];

                            if(badge.badgeCode === badgeCode)
                            {
                                this._badges.splice(j ,1);

                                break;
                            }
                        }

                        for(let j = 0; j < totalCurrentBadges; j++)
                        {
                            const badge = this._currentBadges[j];

                            if(badge.badgeCode === badgeCode)
                            {
                                this._currentBadges.splice(j ,1);

                                break;
                            }
                        }
                    }
                }
            }

            if(this._user.isAuthenticated && this._user.client()) await this._user.client().processComposer(new BadgesComposer(this._user));
        }
    }

    private async loadBadges(): Promise<void>
    {
        if(!this._isLoaded)
        {
            this._badges        = [];
            this._currentBadges = [];

            const results = await getManager().find(UserBadgeEntity, {
                where: {
                    userId: this._user.userId
                }
            });

            const totalResults = results.length;

            for(let i = 0; i < totalResults; i++)
            {
                const badge = results[i];

                const existingBadge: Badge = {
                    id: badge.id,
                    userId: badge.userId,
                    badgeCode: badge.badgeCode,
                    slotNumber: badge.slotNumber
                };

                this._badges.push(existingBadge);

                if(badge.slotNumber > 0 && badge.slotNumber <= 5) this._currentBadges.push(existingBadge);
            }
        }
    }
    
    public async resetAllSlots(): Promise<void>
    {
        await getManager().update(UserBadgeEntity, {
            userId: this._user.userId
        }, {
            slotNumber: 0
        });

        if(this._isLoaded)
        {
            const totalBadges = this._badges.length;

            for(let i = 0; i < totalBadges; i++) this._badges[i].slotNumber = 0;

            this._currentBadges = [];
        }
    }

    public async setSlotNumber(badgeCode: string, slotNumber: 0 | 1 | 2 | 3 | 4 | 5): Promise<void>
    {
        if(badgeCode && slotNumber)
        {
            const result = await getManager().update(UserBadgeEntity, {
                userId: this._user.userId,
                badgeCode: badgeCode,
            }, {
                slotNumber: slotNumber
            });

            if(result.raw.affectedRows === 1)
            {
                if(this._isLoaded)
                {
                    const totalBadges = this._badges.length;

                    for(let i = 0; i < totalBadges; i++)
                    {
                        const badge = this._badges[i];

                        if(badge.badgeCode === badgeCode)
                        {
                            this._badges[i].slotNumber = slotNumber;

                            if(slotNumber > 0 && slotNumber <= 5) this._currentBadges.push(badge);
                        }
                    }
                }
            }
        }
    }

    public get badges(): Badge[]
    {
        return this._badges;
    }

    public get currentBadges(): Badge[]
    {
        return this._currentBadges;
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