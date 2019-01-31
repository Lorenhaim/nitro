import { getManager } from 'typeorm';

import { UserStatisticsEntity, TimeHelper } from '../../../common';

export class Statistics
{
    private _isDisposed: boolean;
    private _isPending: boolean;

    private _isFirstLoginOfDay: boolean;

    constructor(private _entity: UserStatisticsEntity)
    {
        if(!(_entity instanceof UserStatisticsEntity)) throw new Error('invalid_user_info');

        this._isDisposed    = false;
        this._isPending     = false;

        this._isFirstLoginOfDay = false;
    }

    public async save(): Promise<void>
    {
        if(this._isPending)
        {
            await getManager().update(UserStatisticsEntity, this._entity.id, this._entity);

            this._isPending = false;
        }
    }

    public async dispose(): Promise<void>
    {
        if(!this._isDisposed)
        {
            await this.save();

            this._isDisposed = true;
        }
    }

    public updateLoginStreak(type: 'login' | 'logout'): void
    {
        if(type === 'login')
        {
            if(this.loginStreakLast)
            {
                if(TimeHelper.isNextDay(TimeHelper.now, this.loginStreakLast))
                {
                    this._isFirstLoginOfDay = true;

                    this._entity.loginStreak = this.loginStreak + 1;
                }
                else if(!TimeHelper.isToday(this.loginStreakLast))
                {
                    this._isFirstLoginOfDay = true;

                    this._entity.loginStreak = 1;
                }
            }
            else
            {
                this._isFirstLoginOfDay = true;
                
                this._entity.loginStreak = 1;
            }

            this._entity.totalLogins = this.totalLogins + 1;
        }
        else if(type === 'logout')
        {
            if(this.loginStreakLast)
            {
                const daysBetween = TimeHelper.between(TimeHelper.now, this.loginStreakLast, 'days');

                if(daysBetween > 0) this._entity.loginStreak = this.loginStreak + 1;
            }
        }

        this._entity.loginStreakLifetime    = this.loginStreak > this.loginStreakLifetime ? this.loginStreak : this.loginStreakLifetime;
        this._entity.loginStreakLast        = TimeHelper.now;

        this._isPending = true;
    }

    public get userId(): number
    {
        return this._entity.userId;
    }

    public get loginStreak(): number
    {
        return this._entity.loginStreak;
    }

    public get loginStreakLast(): Date
    {
        return this._entity.loginStreakLast;
    }

    public get loginStreakLifetime(): number
    {
        return this._entity.loginStreakLifetime;
    }

    public get totalSecondsOnline(): number
    {
        return this._entity.totalSecondsOnline;
    }

    public get totalLogins(): number
    {
        return this._entity.totalLogins;
    }

    public get totalPacketsProcessed(): number
    {
        return this._entity.totalPacketsProcessed;
    }

    public get isFirstLoginOfDay(): boolean
    {
        return this._isFirstLoginOfDay;
    }
}