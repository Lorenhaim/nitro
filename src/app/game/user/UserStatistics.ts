import { getManager } from 'typeorm';

import { UserStatisticsEntity, TimeHelper } from '../../common';

export class UserStatistics
{
    private _isDisposed: boolean;
    private _isDisposing: boolean;

    private _isPending: boolean;
    private _isSaving: boolean;

    private _isFirstLoginOfDay: boolean;

    constructor(private _entity: UserStatisticsEntity)
    {
        if(!(_entity instanceof UserStatisticsEntity)) throw new Error('invalid_user_info');

        this._isDisposed    = false;
        this._isDisposing   = false;

        this._isPending     = false;
        this._isSaving      = false;

        this._isFirstLoginOfDay = false;
    }

    public async save(): Promise<boolean>
    {
        if(!this._isPending) return Promise.resolve(true);

        if(!this._isSaving)
        {
            this._isSaving = true;

            await getManager().update(UserStatisticsEntity, this._entity.id, this._entity);
        }

        this._isPending = false;
        this._isSaving  = false;

        return Promise.resolve(true);
    }

    public async dispose(): Promise<boolean>
    {
        if(this._isDisposed) return Promise.resolve(true);

        if(!this._isDisposing)
        {
            this._isDisposing = true;

            await this.save();
        }

        this._isDisposed    = true;
        this._isDisposing   = false;

        return Promise.resolve(true);
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
                    this._entity.loginStreak = 1;
                }
                else
                {
                    this._isFirstLoginOfDay = true;
                }
            }
            else
            {
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