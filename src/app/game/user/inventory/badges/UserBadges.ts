import { Manager } from '../../../../common';
import { UserBadgeDao } from '../../../../database';
import { UserBadgeAddComposer, UserBadgesComposer, UserBadgesCurrentComposer } from '../../../../packets';
import { User } from '../../User';
import { Badge } from './Badge';
import { BadgeSlot } from './BadgeSlot';

export class UserBadges extends Manager
{
    private _user: User;

    private _badges: Badge[];
    private _currentBadges: Badge[];

    constructor(user: User)
    {
        super('UserBadges', user.logger);

        if(!(user instanceof User)) throw new Error('invalid_user');

        this._user          = user;
        
        this._badges        = [];
        this._currentBadges = [];
    }

    protected async onInit(): Promise<void>
    {
        await this.loadBadges();
    }

    protected async onDispose(): Promise<void>
    {
        this._badges        = [];
        this._currentBadges = [];
    }

    public getBadge(badgeCode: string): Badge
    {
        const totalBadges = this._badges.length;

        if(!totalBadges) return null;
        
        for(let i = 0; i < totalBadges; i++)
        {
            const badge = this._badges[i];

            if(badge.badgeCode !== badgeCode) continue;
            
            return badge;
        }

        return null;
    }

    public hasBadge(badgeCode: string): boolean
    {
        return this.getBadge(badgeCode) !== null;
    }

    public async giveBadge(...badgeCodes: string[]): Promise<void>
    {
        const addedBadges               = [ ...badgeCodes ];
        const validatedBadges: string[] = [];

        if(!addedBadges) return;
        
        const totalBadges = addedBadges.length;

        if(!totalBadges) return;
        
        for(let i = 0; i < totalBadges; i++)
        {
            const code = addedBadges[i];

            if(!code) continue;

            if(this.hasBadge(code)) continue;

            validatedBadges.push(code);
        }

        const totalValidatedBadges = validatedBadges.length;

        if(!totalValidatedBadges) return;

        const newBadges = await UserBadgeDao.addBadge(this.user.id, ...validatedBadges);

        if(!newBadges) return;

        const totalNewBadges = newBadges.length;

        if(!totalNewBadges) return;
        
        for(let i = 0; i < totalNewBadges; i++)
        {
            const entity = newBadges[i];

            if(!entity) continue;

            const badge: Badge = {
                id: entity.id,
                userId: entity.userId,
                badgeCode: entity.badgeCode,
                slotNumber: entity.slotNumber
            }

            this._badges.push(badge);

            this._user.connections.processOutgoing(new UserBadgeAddComposer(badge));
        }
    }

    public async setCurrentBadges(...badges: { slotNumber: BadgeSlot, badgeCode: string }[]): Promise<void>
    {
        await this.resetBadgeSlots();

        const currentBadges = [ ...badges ];

        if(!currentBadges) return;
        
        const totalBadges = currentBadges.length;

        if(!totalBadges) return;
        
        for(let i = 0; i < totalBadges; i++)
        {
            const badge = currentBadges[i];

            if(!badge) continue;

            if(!badge.slotNumber || badge.slotNumber > BadgeSlot.FIVE || badge.slotNumber < BadgeSlot.NONE) continue;

            const activeBadge = this.getBadge(badge.badgeCode);

            if(!activeBadge) continue;

            activeBadge.slotNumber = <any> badge.slotNumber;
            
            await UserBadgeDao.setBadgeSlot(this._user.id, activeBadge.badgeCode, activeBadge.slotNumber);
        }

        this.loadCurrentBadges();

        this._user.connections.processOutgoing(new UserBadgesCurrentComposer(this._user));
    }

    public async resetBadgeSlots(): Promise<void>
    {
        const totalBadges = this._badges.length;

        if(!totalBadges) return;

        await UserBadgeDao.resetBadgeSlots(this._user.id);

        for(let i = 0; i < totalBadges; i++) this._badges[i].slotNumber = BadgeSlot.NONE;

        this._currentBadges = [];
    }

    public async removeBadge(...badgeCodes: string[]): Promise<void>
    {
        const removedBadges = [ ...badgeCodes ];

        if(!removedBadges) return;
        
        const totalBadges       = removedBadges.length;
        const totalActiveBadges = this._badges.length;

        if(!totalBadges || !totalActiveBadges) return;

        for(let i = 0; i < totalBadges; i++)
        {
            const code = removedBadges[i];

            if(!code) continue;

            for(let j = 0; j < totalActiveBadges; j++)
            {
                const activeBadge = this._badges[j];

                if(!activeBadge) continue;

                if(activeBadge.badgeCode !== code) continue;

                this._badges.splice(j, 1);

                break;
            }
        }

        this.loadCurrentBadges();

        await UserBadgeDao.removeBadge(this._user.id, ...removedBadges);
        
        this._user.connections.processOutgoing(new UserBadgesComposer());
    }

    private async loadBadges(): Promise<void>
    {
        if(this._isLoaded) return;
        
        this._badges        = [];
        this._currentBadges = [];

        const results = await UserBadgeDao.loadUserBadges(this._user.id);

        if(!results) return;

        const totalResults = results.length;

        if(!totalResults) return;
        
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

    public loadCurrentBadges(): void
    {
        this._currentBadges = [];

        const totalBadges = this._badges.length;

        if(!totalBadges) return;

        for(let i = 0; i < totalBadges; i++)
        {
            const badge = this._badges[i];

            if(badge.slotNumber && badge.slotNumber > BadgeSlot.NONE && badge.slotNumber <= BadgeSlot.FIVE) this._currentBadges.push(badge);
        }
    }

    public get user(): User
    {
        return this._user;
    }

    public get badges(): Badge[]
    {
        return this._badges;
    }

    public get currentBadges(): Badge[]
    {
        return this._currentBadges;
    }
}